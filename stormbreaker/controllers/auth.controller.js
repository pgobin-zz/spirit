import passport from '../utils/passport'
import { cassa } from '../config'
import { schema } from '../schema'



/**
 *
 *
 * Login
 *
 *
 * JWT created every login.
 *
 * @param req
 * @param res
 *
 */
const login = (req, res, next) => {
  // Needed on middleware that end with createToken
  res.locals.message = 'Login sucessful.'

  passport.authenticate('local', (error, user) => {
    // TODO: Maybe make return actual error message
    if (error) return schema(res, 500, 'Error querying user.')
    if (!user) return schema(res, 401, 'Incorrect username or password.')

    let payload = { email: user.email, alias: user.alias, id: user.id,
      channelId: user.channelId  }
    let options = { expiresIn: process.env.JWT_EXPIRY }

    res.locals.jwtParams = { payload, options, refreshToken: user.refresh_token }
    return next()
  })(req, res)
}



/**
 *
 *
 * Begin signup flow
 * TODO: Rate limiter and exponential IP ban. Otherwise,
 * TODO cont'd: can be filled with crap from abusers
 *
 * ! Routine may at first glance seem naive.
 * ! It is NOT. It creates many critical guarantees.
 * ! Don't fuck with it.
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
const signup = async (req, res, next) => {

  // Needed on middleware that end with createToken
  res.locals.message = 'Sign up sucessful.'


  // * (1) Create required UUIDs
  // Create channel/user IDs. Must be stored in a variable
  // and not created on database because channel ID is added
  // to both tables and user ID is used in the JWT signing.

  res.locals.channelId = cassa.uuid()
  res.locals.userId = cassa.uuid()
  res.locals.refreshToken = cassa.uuid()


  // * (2) If email not taken, reserve
  // TODO: Consolidate into helper. Also used in edit.
  // Assert email isn't already taken by another user
  // We query email table which is a lookup table created
  // so that the user/channel batch update below can remain
  // atomic and also to guarantee 100% across the cluster
  // that we won't have a concurrency race condition...
  // (i.e., we don't need a lock)
  //
  // It's important that a failure not occur after this
  // because adding this email means it can't be used
  //
  // If that does happen, then a Spark job will ideally
  // remove unused emails that resulted from catastrophic
  // failure to free them up.
  //
  // Password is also saved here, which assists in auth
  // speed when a user logs in.

  let taken
  try {
    let email = new cassa.instance.email({
      email: req.body.email,

      // This is a lookup table so email is primary
      // Non-primary keys that are IDs are prefixed.
      user_id: res.locals.userId,
    })
    let result = await email.saveAsync({

      // Lightweight transactions are a solid guarantee
      // that the record does not exist across cluster

      if_not_exist: true,
      // consistency: cassa.consistencies.quorum
    })

    // If the transaction was not applied, then
    // the email is taken and we return
    taken = !result.rows[0]['[applied]']

  } catch (error) {
    return schema(res, 500, 'Error adding email.')
  }

  if (taken) {
    return schema(res, 401, 'Email already taken.')
  }


  // * (3) Create unique alias
  // An alias makes up the URL to get to a channel page.
  // It must be unique without exception.
  //
  // Create new alias from trimmed and lowercased name string.
  // The alias is that string plus a number. The number is
  // an increment offset by the preceding users with the same
  // compacted name string.
  //
  // This is accomplished by checking the database for the
  // current offset and settings the new number to append to the
  // end of the name to that number + 1.
  //
  // Then we increment the counter in the database.
  // If the new offset has been taken since getting the value
  // from the database, we repeat the process from the start
  // until we know our count is the latest.
  //
  // ! Alias must be stored in lowercase.

  let compactName = req.body.name.replace(/\s/g,'')
  compactName = compactName.toLocaleLowerCase()


  let success, attempt = 1

  while (!success) {

    // On first pass, always increment alias_count, which
    // keeps track of the number of identical compact names that
    // have been used as aliases.
    //
    // The latest count from the alias_count table is used to
    // construct an alias. If the alias constructed can't be added
    // because Cassandra reports it already exists in the alias table,
    // then that means alias_count is probably out-of-sync.
    //
    // So, if attempt is greater than 3, that means the first attempt
    // failed because of something other than an error (i.e.,
    // got unexpectedly state data), then attempts 2 and 3 tried to get
    // fresh data from alias_count in case it was stale, but still
    // Cassandra rejected the update to alias table.
    //
    // In that case, we do an additional increment to alias_count
    // in case a counter increment to alias_count was lost somehow.
    //
    // This is a soft guarantee that the alias is accounted for.

    // Increment 'alias_count'

    if (attempt === 1 || attempt > 3) {
      try {
        let incr = await cassa.instance.alias_count.updateAsync(
          { compact_name: compactName },
          { count: cassa.datatypes.Long.fromInt(1) },
        )
      } catch (error) {
        return schema(res, 500, 'Error incrementing.')
      }
    }


    // Handle total failure
    // This means increment has been tried an additional 2 times
    // and still no luck. Something's wrong so kill it.

    if (attempt > 5) {

      // ? Maybe change username and retry from beginning
      // ? before totally giving up
      return schema(res, 500, 'Error generating alias.')
    }


    // Get the latest count from alias_count. The number is used
    // to construct an alias. If no records exist, than the
    // alias is added without appending any number.

    let latest
    try {
      latest = await cassa.instance.alias_count.findOneAsync({
        compact_name: compactName
      })
    } catch (error) {
      return schema(res, 500, 'Error getting latest.')
    }


    // Construct the alias
    // Count is of type Long, which can't be expressed by Javascript
    // integegers. Therefore it consists of two 32-bit integers.
    // High will never be used, but it's there. Together low and High
    // form a 64-bit integer

    req.alias = compactName + (latest && latest.count.low - 1 || '')


    // Add to alias table (needed for validated taken aliases when
    // a user decides to change his/her alias). If alias not unique,
    // this will jump to the beginning of the loop to try again.

    try {
      let alias = new cassa.instance.alias({
        alias: req.alias,

        // ! Crucial field
        // This is used for mapping alias -> id when
        // cold channel lookups just by alias
        channel_id: res.locals.channelId // already is uuid
      })
      let result = await alias.saveAsync({
        if_not_exist: true,
        // consistency: cassa.consistencies.quorum
      })

      success = result.rows[0]['[applied]']

    } catch (error) {
      return schema(res, 500, 'Error adding alias.')
    }

    attempt += 1
  }

  return next()
}



/**
 *
 *
 * Create new user
 *
 *
 * TODO: Encrypt password
 * @param req
 * @param res
 *
 */
const createUser = async(req, res, next) => {

  // * (1) Add user to database
  // Create one new user and channel row for the new user.
  // Each user gets a new channel by default with a unique alias
  // generated from his/her provided name.

  let userQuery, channelQuery
  try {
    let user = new cassa.instance.user({
      id:             res.locals.userId,
      refresh_token:  res.locals.refreshToken,
      aliases:        [req.alias],
      name:           [req.body.name],
      email:          [req.body.email],
      channels:       [res.locals.channelId],
    })

    if (!await user.setPassword(req.body.password)) {
      return schema(res, 500, 'Error setting password.')
    }

    let channel = new cassa.instance.channel({
      id:             res.locals.channelId,
      alias:          [req.alias],
      name:           [req.body.name]
    })

    userQuery = await user.save({ return_query: true })
    channelQuery = await channel.save({ return_query: true })

  } catch (error) {
    return schema(res, 500, 'Error creating queries/models.')
  }

  // Execute batch
  try {
    await cassa.doBatchAsync([userQuery, channelQuery])
  } catch (error) {
    return schema(res, 500, 'Error creating user.')
  }


  // * (2) Create JWT options

  let options = { expiresIn: process.env.JWT_EXPIRY }
  let payload = {
    email: req.body.email, alias: req.alias,
    id: res.locals.userId, channelId: res.locals.channelId
  }

  res.locals.jwtParams = { payload, options, refreshToken: res.locals.refreshToken }

  return next()
}



export default {
  login: login,
  signup: signup,
  createUser: createUser
}
