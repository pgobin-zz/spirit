/**
 *
 * 'channel_following' table schema
 *
 * Defines the schema for the table 'channel_following'
 *
 * @key PRIMARY
 * @field
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    follower_id:            'uuid',
    followed_id:            'uuid',

    is_live:                'boolean',
    follower_name:          { type: 'list', typeDef: '<text>' }, // ? Static
    follower_alias:         { type: 'list', typeDef: '<text>' }, // ? Static
    followed_name:          { type: 'list', typeDef: '<text>' }, // ? Static
    followed_alias:         { type: 'list', typeDef: '<text>' }, // ? Statis
  },

  key: ['follower_id', 'followed_id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  }
}
