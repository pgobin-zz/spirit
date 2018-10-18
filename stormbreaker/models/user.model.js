import { hashPassword } from '../utils/password'

/**
 *
 * 'user' table schema
 *
 * Defines the schema for the table 'user'
 *
 * @key PRIMARY
 * @field
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    id:                 'uuid',

    hash:               'blob',
    salt:               'blob',
    name:               { type: 'list', typeDef: '<text>' },
    email:              { type: 'list', typeDef: '<text>' },

    aliases:            { type: 'list', typeDef: '<text>' },
    channels:           { type: 'list', typeDef: '<uuid>' },

    token_balance:      { type: 'int', default: 0 },
    stripe_customer_id: { type: 'list', typeDef: '<text>' },

    refresh_token:      { type: 'uuid', default: { '$db_function': 'uuid()' } }
  },

  key: ['id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  },

  methods: {
    setPassword: async function (password) {
      const result = await hashPassword(password)
      if (!result) return false

      this.salt = result.salt
      this.hash = result.hash
      return true
    }
  }
}
