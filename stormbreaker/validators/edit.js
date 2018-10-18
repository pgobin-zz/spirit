import joi from 'joi'

export default {
  body: {
    channel: joi.object().keys({
      about: joi.string().max(500)
    }),
    account: joi.object().keys({
      alias: joi.string().regex(/^[a-zA-Z0-9]{3,50}$/),
      email: joi.string().email()
    }),
    password: joi.object().keys({
      currentPassword: joi.string().regex(/^.{6,}$/),
      newPassword: joi.string().regex(/^.{6,}$/)
    })
  },
  headers: {
    'content-type': joi.string().valid('application/json').required()
  },
  options : {
    allowUnknownBody: false
  }
}
