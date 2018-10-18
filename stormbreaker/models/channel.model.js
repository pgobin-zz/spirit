/**
 *
 *
 * 'channel' table schema
 *
 * Defines the schema for the table 'channel'
 *
 *
 * @key PRIMARY
 * @field
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    id:                     'uuid',

    about:                  { type: 'list', typeDef: '<text>' },
    alias:                  { type: 'list', typeDef: '<text>' },
    name:                   { type: 'list', typeDef: '<text>' },
    received_token_balance: { type: 'int', default: 0 }
  },

  key: ['id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  }
}
