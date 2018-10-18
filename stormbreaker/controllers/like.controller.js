import { cassa } from '../config'
import { schema } from '../schema'
// import request from 'request'


/**
 *
 *
 *
 * @param req
 * @param res
 */
const like = async (req, res, next) => {
  if (!req.body.type || !req.body.id) return schema(res, 400, 'Unsupported body.')
  if (req.body.type !== 'like') return next()

  // Validate id of video to like

}
