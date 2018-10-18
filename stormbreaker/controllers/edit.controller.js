import { cassa } from '../config'
import { schema } from '../schema'
import { verifyPassword} from '../utils/password'


/**
 *
 *
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
const prepareResponse = (req, res, next) => {
  res.locals.message = 'Update successful.'
  // if (!res.locals.updatetoken) return next()

  // all these methods require new token
  // if email/alias whatever not updated, then
  // password must be, so defauly to provided and create options
  let email = res.locals.newEmail || req.user.email
  let alias = res.locals.newAlias || req.user.alias


  // * (4) Create new JWT
  // Because a new alias has been created, a new JWT must be
  // created and returned to the user with the updated alias

  let payload = { email: email, alias: alias, id: req.user.id,
    channelId: req.user.channelId  }
  let options = { expiresIn: process.env.JWT_EXPIRY }

  res.locals.jwtParams = { payload, options }


    // Set response message for createToken()
  // If response message exists, then that middleware
  // knows it's the last in the chain and will respond
  // with this message


  return next()
}



/**
 *
 *
 * Update password
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
const updatePassword = async (req, res, next) => {

  // ` Skip middleware if alias isn't being edited
  if (!req.body.password) return next()
  // if (!req.body.password) return next()

  // New alias from user
  // Alias must always be lowercase

  let currentPassword = req.body.password.currentPassword
  let newPassword = req.body.password.newPassword



let user
  try {
    user = await cassa.instance.user.findOneAsync({
      id: cassa.uuidFromString(req.user.id)
    })
  } catch (error) {
    return done('Error querying user.', null)
  }


  // In case an email exists but account creation
  // failed after the reservation.
  if (!user) return schema(res, 404, 'No user.')


   // * (2) Validate password

  const ok = await verifyPassword(currentPassword, user.hash, user.salt)
  if (ok === false) return schema(res, 401, 'Wrong password.')
  if (ok === null) return schema(res, 500, 'Error verifying password.')



  // * (2) Update 'user'
  // Create a query for the email in the user table. This
  // allows a user to see the new email in his/her profile, etc.

  let userQuery
  try {
    let user = new cassa.instance.user({
      id: cassa.uuidFromString(req.user.id)
    })

    if (!await user.setPassword(newPassword)) {
      return schema(res, 500, 'Error setting password.')
    }



    userQuery = await user.save({ return_query: true })
  } catch (error) {
    return schema(res, 500, 'Error creating queries.')
  }

  // Execute batch
  try {
    await cassa.doBatchAsync([userQuery])
  } catch (error) {
    return schema(res, 500, 'Error updating user.')
  }

  return next()
}



/**
 *
 *
 * Update channel alias.
 *
 *
 * Alias is the unique string that identifies
 * a channel and is what appears in a URL to a channel.
 *
 * If the transactions succeed, it is up to Spark
 * to reclaim the alias. Maybe... not sure yet.
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
const updateEmail = async (req, res, next) => {

  // ` Skip middleware if alias isn't being edited
  if (!req.body.account) return next()
  if (!req.body.account.email) return next()

  // New alias from user
  // Alias must always be lowercase

  res.locals.newEmail = req.body.account.email.toLocaleLowerCase()


  // * (1) If email not taken, reserve
  // Make sure email is not used already. To do that,
  // we use a lightweight transaction to immediately
  // and strongly purchase the alias across the cluster
  // (i.e., linearizable consistency)

  let taken
  try {
    let email = new cassa.instance.email({
      email: res.locals.newEmail,
      user_id: cassa.uuidFromString(req.user.id)
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


  // * (2) Update 'user'
  // Create a query for the email in the user table. This
  // allows a user to see the new email in his/her profile, etc.

  let userQuery
  try {

    userQuery = cassa.instance.user.update(
      { id: cassa.uuidFromString(req.user.id) },
      { email: { '$prepend': [res.locals.newEmail] } },
      { return_query: true }
    )
  } catch (error) {
    return schema(res, 500, 'Error creating queries.')
  }

  // Execute batch
  try {
    await cassa.doBatchAsync([userQuery])
  } catch (error) {
    return schema(res, 500, 'Error updating user.')
  }

  return next()
}


/**
 *
 *
 * Update channel alias.
 *
 *
 * Alias is the unique string that identifies
 * a channel and is what appears in a URL to a channel.
 *
 * If the transactions succeed, it is up to Spark
 * to reclaim the alias. Maybe... not sure yet.
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
const updateAlias = async (req, res, next) => {

  // ` Skip middleware if alias isn't being edited
  if (!req.body.account) return next()
  if (!req.body.account.alias) return next()

  // New alias from user
  // Alias must always be lowercase

  res.locals.newAlias = req.body.account.alias.toLocaleLowerCase()


  // * (1) If alias not taken, reserve
  // Make sure alias is not used already. To do that,
  // we use a lightweight transaction to immediately
  // and strongly purchase the alias across the cluster
  // (i.e., linearizable consistency)

  let taken
  try {
    let alias = new cassa.instance.alias({
      alias: res.locals.newAlias,
      channel_id: cassa.uuidFromString(req.user.channelId)
    })
    let result = await alias.saveAsync({

      // Lightweight transactions are a solid guarantee
      // that the record does not exist across cluster

      if_not_exist: true,
      // consistency: cassa.consistencies.quorum
    })

    // If the transaction was not applied, then
    // the alias is taken and we return
    taken = !result.rows[0]['[applied]']

  } catch (error) {
    return schema(res, 500, 'Error adding alias.')
  }

  if (taken) {
    return schema(res, 401, 'Alias already taken.')
  }


  // * (2) Update 'channel' + 'user'
  // Create a query for the alias in the channel table. This
  // allowa a user to visit a channel with the new alias.
  //
  // Also create a query for the alias in the user table. This
  // allows a user to see the new alias in his/her profile, etc.

  let channelQuery, userQuery
  try {
    channelQuery = cassa.instance.channel.update(
      { id: cassa.uuidFromString(req.user.channelId) },
      { alias: [res.locals.newAlias] },
      { return_query: true }
    )
    userQuery = cassa.instance.user.update(
      { id: cassa.uuidFromString(req.user.id) },
      { aliases: { '$prepend': [res.locals.newAlias] } },
      { return_query: true }
    )
  } catch (error) {
    return schema(res, 500, 'Error creating queries.')
  }

  // Execute batch
  try {
    await cassa.doBatchAsync([channelQuery, userQuery])
  } catch (error) {
    return schema(res, 500, 'Error updating user/channel.')
  }


  // * (3) Update alias for current live streams
  // If the channel is live we need to update alias in the db.
  // If the channel is not live, it doesn't matter because the current
  // alias will be used the next time the user is live.

  // Note that Cassandra requires a separate operation for conditional
  // transactions. IF EXISTS is used so a new record isn't created.

  try {
    await cassa.instance.stream.updateAsync(
      { channel_id: cassa.uuidFromString(req.user.channelId), is_live: true },
      { alias: [res.locals.newAlias] },
      { if_exists: true }
    )
  } catch (error) {
    // Pass-through.
    // If this fails it's not the end of the world.
    console.error(error)
  }


  // * (4) Create new JWT
  // Because a new alias has been created, a new JWT must be
  // created and returned to the user with the updated alias

  // let payload = { email: req.user.email, alias: alias, id: req.user.id,
  //   channelId: req.user.channelId  }
  // let options = { expiresIn: process.env.JWT_EXPIRY }

  // res.locals.jwtParams = { payload, options }

  return next()
}



/**
 *
 *
 * Update channel description
 *
 *
 * ! Entry point to edit middleware pipe. Must always be first,
 * ! unless you move res.locals.message to the new first
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
const updateAbout = async (req, res, next) => {
  if (!req.body.channel.about) return next()



  let id = cassa.uuidFromString(req.user.channelId)

  try {
    let channel = new cassa.instance.channel({
      id: id,
      about: [req.body.channel.about]
    })
    channel = await channel.saveAsync()
  } catch (error) {
    return schema(res, 500, 'Error updating description.')
  }

  return next()
}



export default {
  updateAlias: updateAlias,
  updateAbout: updateAbout,
  updateEmail: updateEmail,
  updatePassword: updatePassword,
  prepareResponse: prepareResponse
}
