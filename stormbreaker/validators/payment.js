import joi from 'joi'

export default {
  body: {
    id: joi.string().token().required()
    // regex(/^[a-zA-Z0-9]{3,50}$/)
  },
  headers: {
    'content-type': joi.string().valid('application/json').required()
  },
  options : {
    allowUnknownBody: true
  }
}
