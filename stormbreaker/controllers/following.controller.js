import { cassa } from '../config'
import { schema } from '../schema';


/**
 *
 *
 * Add chan
 * nel to user following
 *
 * @param channel
 * @param req
 * @param res
 *
 */
const follow = async (req, res, next) => {
  if (req.body.unfollow) return next()

  try {
    let following = new cassa.instance.channel_following({
      follower_id:      cassa.uuidFromString(req.user.channelId),
      followed_id:      req.channel.id,
      followed_name:    req.channel.name,
      followed_alias:   req.channel.alias,
    })
    await following.saveAsync()
  } catch (error) {
    return schema(res, 500, 'Error following channel.')
  }

  return schema(res, 200, 'Channel added to following')
}



/**
 *
 *
 * Unfollow channel
 *
 *
 * @param req
 * @param res
 *
 */
const unfollow = async (req, res) => {
  try {
    await cassa.instance.channel_following.delete({
      follower_id: cassa.uuidFromString(req.user.channelId),
      followed_id: req.channel.id
    })
  } catch (error) {
    return schema(res, 500, 'Error unfollowing channel.')
  }

  return schema(res, 200, 'Unfollowed channel.')
}



/**
 *
 *
 * Validate follow request
 *
 *
 * Channel must always be validaed before follow and uunfollow.
 * Therefore this is always hit.
 *
 *
 * @param req
 * @param res
 *
 */
const verify = async (req, res, next) => {

    // * (1) Assert channel is not user
    // Check alias from trusted JWT against body to determine
    // if channel is not user

    if (req.body.id === req.user.channelId) {
      return schema(res, 401, 'Can\'t follow your own channel.')
    }


    // * (2) Assert channel exists
    // Check if channel exists in database

    try {
      req.channel = await cassa.instance.channel.findOneAsync({
        id: cassa.uuidFromString(req.body.id)
      })
    } catch (error) {
      return schema(res, 500, 'Error querying channel.')
    }

    if (!req.channel) {
      return schema(res, 404, 'Channel doesn\'t exist.')
    }

    return next()
}



/**
 *
 *
 * Get channels user follows
 *
 *
 * @param req
 * @param res
 *
 */
const getFollowing = async (req, res) => {
  let following

  try {
    following = await cassa.instance.channel_following.findAsync(
      { follower_id: cassa.uuidFromString(req.user.channelId) },
      { fetchSize: 1, pageState: req.query.next }
    )
  } catch (error) {
    return schema(res, 500, 'Error getting following.')
  }

  res.send({ following: following, next: following.pageState })
}



/**
 *
 * ? Wow
 * ? Spark
 * TODO: Such wow. What to do about this...
 * @param req
 * @param res
 *
 */
const getFollowingLive = async (req, res) => {

  let following
  try {
    following = await cassa.instance.channel_following.findAsync(
      { follower_id: cassa.uuidFromString(req.user.channelId) },
      { pageState: req.query.next, fetchSize: 1 }
    )
  } catch (error) {
    return schema(res, 500, 'Error querying user.')
  }


  let live = []

  cassa.instance.stream.stream(
    { is_live: true }, function (reader) {

    let row
      while (row = reader.read()) {
        let found = following.find(item => {
          let match = item.channel_id.equals(row.channel_id)
          return match ? live.push({ ...item, ...row }) : false
        })
      }

}, function(err) {
  if (err) {
    return schema(res, 500, 'Error processing following live.')
  }
  return res.send({ following_live: live })
})

}



export default {
  follow: follow,
  unfollow: unfollow,
  verify: verify,
  getFollowing: getFollowing,
  getFollowingLive: getFollowingLive
}
