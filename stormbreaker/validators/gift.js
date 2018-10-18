import joi from 'joi'

export default {
  body: {
    // TODO: guid() or hashid check
    giftId: joi.string().token().max(50).required(),
    to: joi.string().required
  },
  headers: {
    'content-type': joi.string().valid('application/json').required()
  },
  options : {
    allowUnknownBody: false
  }
}
