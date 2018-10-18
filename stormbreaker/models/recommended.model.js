/**
 *
 * 'recommended' table schema
 *
 * Defines the schema for the table 'recommended', which contains
 * recommended videos populated from Spark, which ranks videos
 * based on certain metrics and puts them in this table.
 *
 * @field
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    id:             'uuid',

    views:          'bigint',
    likes:          'bigint',
    title:          { type: 'list', typeDef: '<text>' },
    tags:           { type: 'list', typeDef: '<text>' },
    channel_alias:  { type: 'list', typeDef: '<text>' },
    channel_name:   { type: 'list', typeDef: '<text>' },
    channel_id:     'uuid',
    // rank:           'double'
  },

  key: ['id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  }
}
