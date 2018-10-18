import { cassa } from '../config'
import { schema } from '../schema'



/**
 *
 *
 *
 * @param req
 * @param res
 *
 */
const respond = (req, res) => {
  return schema(res, 'channel', res.locals.channel)
}



/**
 *
 *
 * Get channel info by alias
 *
 *
 * Get channel information using provided alias. This is
 * required for cold lookups where the id is not known and the
 * alias is the only thing to go by.
 *
 * If a channel updates its alias, the denormalized tables
 * have no way of knowing that. Since cold lookups (user straight
 * types a channel URL in the browser) have the latest alias, this
 * function works fine for that case.
 *
 * However, if the channel is requested from the follow list, then
 * the ID must be used to query as it's fixed and the alias may have
 * changed.
 *
 * Therefore, the ID is passed as an alt query param in
 * those cases.
 *
 * Client logic could make it so that it directly asks another
 * endpoint, but this works for now
 *
 * If 'alt' exists, then skip to the next middleware which looks up
 * by ID.
 *
 * This may also seem incorrect or duplicative, buy it's
 * not so don't fuck it up.
 *
 *
 * @param req
 * @param res
 *
 */
const getChannel = async (req, res, next) => {

  // * (1) If alt param exists skip middleware
  // ` Skip the following channel lookup and go directly
  // ` to ID lookup using the provided alt query param ID

  if (req.query.alt) return next()


  let alias = req.params.alias.toLocaleLowerCase()


  // * (2) Get channel info
  // First, ID -> alias lookup (using 'alias'lookup table).
  // Then get channel info, which hydrates the channel page
  // and includes the name and description.

  let channel
  try {
    let lookup = await cassa.instance.alias.findOneAsync({
      alias: alias
    })
    channel = await cassa.instance.channel.findOneAsync({
      id: lookup.channel_id
    })
  } catch (error) {
    return schema(res, 500, 'Error querying channel or lookup.')
  }
  if (!channel) {
    return schema(res, 404, 'Channel doesn\'t exist.')
  }


  // * (3) Get stream info
  // If channel is live, then this will provide additional info.
  // Note that if there is nothing, we continue as normal.

  let live
  try {
    live = await cassa.instance.stream.findOneAsync({
      channel_id: channel.id,
      is_live: true
    })
  } catch (error) {
    return schema(res, 500, 'Error querying stream.')
  }


  // * (4) Persist info across middleware
  // Assign merged object to req.locals
  // req.locals is an object guarantted to exist between
  // middleware calls
  //
  // Note that the order of the destructuring matters
  // If there's any problem live's channel data, channel
  // should override it (i.e., name is null in live())
  res.locals.channel = { ...live, ...channel }


  // Proceed to next, which will be pass-through
  return next()

  // return schema(res, 'channel', { ...channel, ...live })
}



/**
 *
 *
 * Get channel info by ID
 *
 *
 * Note we use alt query param because we need to know the old
 * alias wihout having to make an additiona trip to the database.
 *
 *
 * TODO: parallelize
 * @param req
 * @param res
 *
 */
const orTryWithId = async (req, res, next) => {

  // * (1) If channel lookup already occurred skip middleware
  // ` That means we had to cold lookup the channel by alias
  // ` and the previous middleware was successful.

  if (res.locals.channel) return next()


  // * (1) Get channel info
  // By ID
  // Channel info hydrates the channel page and includes the name,
  // alias and description. Called every time a channel page loads.

  let channel
  try {
    channel = await cassa.instance.channel.findOneAsync({
      id: cassa.uuidFromString(req.query.alt)
    })
  } catch (error) {
    return schema(res, 500, 'Error querying channel.')
  }


  // * (3) Get stream info
  // By ID
  // If channel is live, then this will provide additional info.
  // Note that if there is nothing, we continue as normal.

  let live
  try {
    live = await cassa.instance.stream.findOneAsync({
      channel_id: cassa.uuidFromString(req.query.alt),
      is_live: true
    })
  } catch (error) {
    return schema(res, 500, 'Error querying stream.')
  }

  if (!channel) {
    return schema(res, 404, 'Channel doesn\'t exist.')
  }


  // * (4) Persist info across middleware
  // Assign merged object to req.locals
  // req.locals is an object guarantted to exist between
  // middleware calls
  res.locals.channel = { ...live, ...channel }


  // Alias has changed so proceed to next middleware
  // Other fields may be checked here later...
  if (channel.alias !== req.params.alias) {
    res.locals.isSyncRequired = true
  }


  // Proceed to next, which will be pass-through
  // if the above isSyncRequired is not set
  return next()


  // // Alias has not changed so end it
  // return schema(res, 'channel', req.locals.channel)
}



/**
 *
 *
 * Update denormalized data
 *
 *
 * ? Move to Spark
 * @param req
 * @param res
 *
 */
const syncDenormData = async (req, res, next) => {

  // * (1) If sync not required
  // ` That means the previous middleware found no inconsistency
  // ` between aliases. Skip to the next middleware.

  if (!res.locals.isSyncRequired) return next()


  // Just following for now
  // This will probably be offloaded to a worker

  let followingQuery
  try {
    let following = new cassa.instance.channel_following({
      follower_id:      cassa.uuidFromString(req.user.channelId),
      followed_id:      cassa.uuidFromString(req.query.alt),
      followed_alias:   [res.locals.channel.alias]
    })

    followingQuery = await following.save({ return_query: true })

  } catch (error) {
    return schema(res, 500, 'Error creating queries.')
  }

  // Execute batch
  try {
    await cassa.doBatchAsync([followingQuery])
  } catch (error) {
    return schema(res, 500, 'Error syncing data.')
  }

  return next()

  // return schema(res, 'channel', { ...req.channel, ...req.live })
}



export default {
  respond: respond,
  getChannel: getChannel,
  orTryWithId: orTryWithId,
  syncDenormData: syncDenormData
}
