import { cassa } from '../config'
import { schema } from '../schema'



/**
 *
 *
 * Start live stream
 *
 *
 * @param req
 * @param res
 *
 */
const startStream = async (req, res, next) => {
  if (req.body.stop) return next()

  let streamQuery, videoQuery

  try {
    let video, stream

    if (process.env.NODE_ENV === 'production') {
      stream = new cassa.instance.stream({
        channel_id:       cassa.uuidFromString(req.user.channelId),
        is_live:          true,
        start_time:       new Date(),
        title:            [req.body.title],
        alias:            [req.user.alias],
        tags:             req.body.tags // already an array
      })
      video = new cassa.instance.video({
        channel_id:       cassa.uuidFromString(req.user.channelId),
        channel_alias:    [req.user.alias],
        tags:             req.body.tags, // already a list
        title:            [req.body.title]
      })



    // ! USE TO LOAD IN DATA
    } else {
      stream = new cassa.instance.stream({
        channel_id:       cassa.uuidFromString(req.user.channelId),
        is_live:          true,
        start_time:       new Date(),
        title:            [req.body.title],
        alias:            [req.user.alias],
        tags:             req.body.tags, // already an array
        live_view_count:  cassa.datatypes.Long.fromInt(req.body.live_view_count)
      })
      video = new cassa.instance.video({
        channel_id:       cassa.uuidFromString(req.user.channelId),
        channel_alias:    [req.user.alias],
        tags:             req.body.tags, // already a list
        title:            [req.body.title],
      })
    }

    streamQuery = await stream.save({ return_query: true })
    videoQuery = await video.save({ return_query: true })

  } catch (error) {
    return schema(res, 500, 'Error creating queries.')
  }

  // Execute batch
  try {
    await cassa.doBatchAsync([streamQuery, videoQuery])
  } catch (error) {
    return schema(res, 500, 'Error adding stream.')
  }

  return res.send({ isLive: true })
}



/**
 *
 *
 * Stop stream
 *
 *
 * @param req
 * @param res
 *
 */
const stopStream = async (req, res) => {
  try {
    let channelLive = new cassa.instance.stream({
      channel_id:     cassa.uuidFromString(req.user.channelId),
      start_time:     req.stream.start_time,
      is_live:        false,
      stop_time:      new Date()
    })
    await channelLive.saveAsync()
  } catch (error) {
    return schema(res, 500, 'Error stopping stream.')
  }

  return res.send({ isLive: false })
}



/**
 *
 *
 * Validate live request
 *
 *
 * Note that channel ID comes from JWT so no need to validate
 * channel against database.
 *
 * @param req
 * @param res
 *
 */
const verify = async (req, res, next) => {

    // * (1) Assert channel isn't live
    // Determine if channel is live already
    // Ordered in cassandra already by start_time, so will get the latest

    try {
      req.stream = await cassa.instance.stream.findOneAsync({
        channel_id: cassa.uuidFromString(req.user.channelId),
        is_live: true
      })
    } catch (error) {
      return schema(res, 500, 'Error querying stream.')
    }



    // * (2) Handle impossible scenario #1
    // Cannot start stream when channel is live. Must first stop.
    // Therefore, this is invalid and appropriate response sent.

    const isLiveAndStartRequested =
      req.stream &&               // There is a stream
      req.stream.is_live &&       // And it's live (could not be)
      !req.body.stop  // And start requested

    if (isLiveAndStartRequested) {
      return schema(res, 400, 'Channel already live.')
    }



    // * (3) Handle impossible scenario #2
    // This may seem wrong, but it's right, don't fuck with it.
    // First of all, if there is no stream returned above, that means
    // a stream has never been added even once.
    //
    // If a stop is requested and there's no stream OR if there is
    // a stream but it's not live (i.e., a previous live stream that
    // has already ended), the following sends a message that a stop
    // can't occur in those scenarios.

    const isStoppedOrNeverExistedAndStopRequested =
      (
        !req.stream &&              // There has never been a stream
        req.body.stop               // and stop requested
      ) ||                          //
      (                             // OR
        req.stream &&               // There is a stream,
        !req.stream.is_live &&      // it isn't live,
        req.body.stop               // and stop requested
      )

    if (isStoppedOrNeverExistedAndStopRequested) {
      return schema(res, 400, 'Invalid stop request.')
    }

    return next()
}



export default {
  startStream: startStream,
  stopStream: stopStream,
  verify: verify
}
