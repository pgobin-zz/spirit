import express from 'express'
import validate from 'express-validation'
import * as validators from './validators'
import { schema } from './schema'
import {
  Auth,
  Channel,
  Payment,
  Subscription,
  Following,
  Live,
  Me,
  Edit,
  Token,
  Gift,
  Video
} from './controllers'



/**
 *
 *
 * Require user middleware
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
const requiresUser = (req, res, next) => {
  return req.user ? next() :
    schema(res, 401, 'Please authenticate before attempting request.')
}



const router = express.Router();



/**
 *
 * GETs
 *
 */
router.get('/', (req, res) => schema(res, 400, 'Unsupported request'))

router.get('/me',                 requiresUser, Me.me)
router.get('/me/following',       requiresUser, Following.getFollowing)
router.get('/me/followingLive',   requiresUser, Following.getFollowingLive)
router.get('/me/recommended',     Me.getRecommended)

// router.get('/me/:alias',          requiresUser, validate(validators.me.channel), Me.getChannelMe)
router.get('/:alias',             Channel.getChannel, Channel.orTryWithId, Channel.syncDenormData,
                                  Me.getFollowingAndSubscribedStatusForChannel, Channel.respond)



/**
 *
 * POSTs
 *
 */
router.post('/me/following',      requiresUser, validate(validators.following),
                                  Following.verify, Following.follow, Following.unfollow
)
router.post('/me/subscriptions',  requiresUser, validate(validators.subscription),
                                  Subscription.verify, Subscription.subscribe, Subscription.unsubscribe
)
router.post('/me/live',           requiresUser, validate(validators.live),
                                  Live.verify, Live.startStream, Live.stopStream
)
router.post('/me/payments',       requiresUser, validate(validators.payment),
                                  Payment.addOrUpdatePayment
)
router.post('/me/tokens',         requiresUser, validate(validators.token),
                                  Token.buyTokens
)
router.post('/me/gifts',          requiresUser, validate(validators.gift),
                                  Gift.sendGift
)
router.post('/me/edit',           requiresUser, validate(validators.edit),
                                  Edit.updateAbout, Edit.updateAlias, Edit.updateEmail,
                                  Edit.updatePassword, Edit.prepareResponse
)
router.post('/videos',            requiresUser, //validate(validators.edit),
                                  Video.addMetadata
)


router.post('/login',             validate(validators.login), Auth.login)
router.post('/users',             validate(validators.signup), Auth.signup, Auth.createUser)



export default router
