/**
 *
 * 'subscription' table schema
 *
 * Defines the schema for the table 'subscription'
 *
 * @key PRIMARY
 * @field
 *
 */
export default {
  fields: {

    //PRIMARY KEY
    subscriber_id:                'uuid',
    subscribed_id:                'uuid',

    expires:                      'timestamp',
    subscriber_alias:             { type: 'list', typeDef: '<text>' },
    subscriber_name:              { type: 'list', typeDef: '<text>' },
    subscribed_alias:             { type: 'list', typeDef: '<text>' },
    subscribed_name:              { type: 'list', typeDef: '<text>' },
    stripe_subscription_id:       { type: 'list', typeDef: '<text>' }
  },

  key: ['subscriber_id', 'subscribed_id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  }
}
