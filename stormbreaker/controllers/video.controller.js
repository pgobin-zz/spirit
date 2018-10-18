import { cassa } from '../config'
import { schema } from '../schema'



/**
 *
 *
 * Upload
 *
 *
 * @param req
 * @param res
 *
 */
const addMetadata = async (req, res, next) => {

  let videoQuery, viewsAndLikesQuery

  res.locals.videoId = cassa.uuid()

  try {
    let video

    if (process.env.NODE_ENV === 'production') {
      video = new cassa.instance.video({
        id:             res.locals.videoId,
        channel_id:     cassa.uuidFromString(req.user.channelId),
        channel_alias:  [req.user.alias],
        tags:           req.body.tags, // already a list
        title:          [req.body.title]
      })

    // ! USE TO LOAD IN DATA
    // Unfortunately, Cassandra does not allow batch queries for
    // counter columns mixed with others. Dev env, so not a problems
    } else {
      video = new cassa.instance.video({
        id:             res.locals.videoId,
        channel_id:     cassa.uuidFromString(req.user.channelId),
        channel_alias:  [req.user.alias],
        tags:           req.body.tags, // already a list
        title:          [req.body.title],
      })

      cassa.instance.video_views_likes.updateAsync(
        { id:             res.locals.videoId },
        { views:          cassa.datatypes.Long.fromInt(req.body.views),
          likes:          cassa.datatypes.Long.fromInt(req.body.likes),
        }
      )
    }

    videoQuery = await video.save({ return_query: true })

  } catch (error) {
    return schema(res, 500, 'Error creating queries.')
  }

  // Execute batch
  try {
    await cassa.doBatchAsync([videoQuery])
  } catch (error) {
    return schema(res, 500, 'Error adding video.')
  }

  return schema(res, 200, 'Successfully added video.')
}



export default {
  addMetadata: addMetadata
}
