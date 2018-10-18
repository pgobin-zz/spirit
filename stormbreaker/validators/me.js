import joi from 'joi'

const channel = {
  params: {
    alias: joi.string().regex(/^[a-zA-Z0-9]{3,50}$/).lowercase()
  }
}

export default {
  channel: channel
}
