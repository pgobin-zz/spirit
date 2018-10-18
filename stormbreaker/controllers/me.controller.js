import { cassa } from '../config'
import { Subscription } from '.'
import { schema } from '../schema'



/**
 *
 *
 * Get user info
 *
 *
 * @param req
 * @param res
 *
 */
const me = async (req, res) => {
  let user

  try {
    user = await cassa.instance.user.findOneAsync({
      id: cassa.uuidFromString(req.user.id)
    })
  } catch (error) {
    return schema(res, 500, 'Error querying user.')
  }

  if (user) return schema(res, 'user', user)
  return schema(res, 404, 'User does not exist.')
}



/**
 *
 *
 * Get whether or not a user is following or subscribed to a
 * particular channel. Called when the channel page is loading
 *
 * //This is why unfortunately the channel_following and
 * //channel_subscribed tables required an index on channel_alias.
 * //Probably better than reading to get the alias.
 *
 * This is done as the last middleware and as part of
 * this request because we have access to the channel
 * ID which was either retrieved or provided in the alt param.
 * Therefore that's one less database call. If this was a
 * separate request, we'd either have to lookup the ID or query
 * a secondary index on channel_following and channel_subscribed.
 * I'm trying to avoid that so here goes.
 *
 *
 * ? Maybe check if provided channel is legit
 *
 * @param req
 * @param res
 *
 */
const getFollowingAndSubscribedStatusForChannel = async (req, res, next) => {

  // * (1) If channel is user's own, then skip
  // ` That means the channel belongs to the user and not
  // ` follow or subscribe check is needed. So we skip.
  // ` Note the !req.user check which makes sure we even have
  // ` an authenticated user making this request. It could be anyone,
  // ` meaning we would skip all of this and just return the channel.

  if (!req.user) return next()
  if (req.user.channelId === res.locals.channel.id.toString()) return next()


  // * (2) Get if user is following or subscribed
  // Determine if the user is following/subscribed to the channel
  // By querying the channel_following and channel_subscribed tables.

  let following, subscription

  try {
    following = await cassa.instance.channel_following.findOneAsync({
      follower_id: cassa.uuidFromString(req.user.channelId),
      followed_id: res.locals.channel.id // is already uuid
    })

    subscription = await cassa.instance.channel_subscribed.findOneAsync({
      subscriber_id: cassa.uuidFromString(req.user.channelId),
      subscribed_id: res.locals.channel.id // is already uuid
    })
  } catch (error) {
    return schema(res, 500, 'Error getting channel me info.')
  }


  // * (3) Get subscription status
  // From the subscription reponse, we need to calculate if
  // the expiration has been reached.

  const subscriptionStatus = Subscription.getStatus(subscription)


  // * (4) Prepare final object
  // Combine this info with the existing channel stuff

  res.locals.channel = {
    ...res.locals.channel,
    ...subscriptionStatus,
    isFollowing: !!following
  }

  return next()
  // res.send({ ...subscriptionStatus, isFollowing: !!following })
}



/**
 *
 *
 * Get recommended videos and popular tags
 *
 *
 * @param req
 * @param res
 *
 */
const getRecommended = async (req, res) => {
  let recommended, streams, tags

  try {

    // Get live from the 'stream_by_rank' materialized view
    // Rank is calculated by Spark
    streams = await cassa.instance.stream.findAsync(
      { is_live: true, $limit: 20 },
      { materialized_view: 'stream_by_rank' }
    )


    recommended = await cassa.instance.recommended.findAsync({})


    // Get popular tags from the 'tag' table
    tags = await cassa.instance.tag.findAsync({ $limit: 5 })
  } catch (error) {
    return schema(res, 500, 'Error retrieving recommended.')
  }

  // next: recommended.pageState
  res.send({ recommended: recommended, streams: streams, tags: tags })
}



export default {
  me: me,
  getFollowingAndSubscribedStatusForChannel: getFollowingAndSubscribedStatusForChannel,
  getRecommended: getRecommended
}
