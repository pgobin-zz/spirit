import joi from 'joi'

export default {
  body: {
    amount: joi.number().positive().integer().max(1e6).required()
  },
  headers: {
    'content-type': joi.string().valid('application/json').required()
  },
  options : {
    allowUnknownBody: false
  }
}
