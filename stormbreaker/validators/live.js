import joi from 'joi'



// TODO: do joi "with" so combos can be enforced
export default {
  body: {
    stop: joi.bool(),
    title: joi.string().regex(/^.{1,100}$/),
    tags: joi.array().min(1).max(20)
  },
  headers: {
    'content-type': joi.string().valid('application/json').required()
  },
  options : {
    allowUnknownBody: process.env.NODE_ENV !== 'production'
  }
}
