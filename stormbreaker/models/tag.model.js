/**
 *
 * 'tag' table schema
 *
 * Defines the schema for the table 'tag', which contains
 * all the tags tagged from live streams and also those
 * created in-house
 *
 * @key id - primary key
 *
 * @field id - unique id per tag
 * @field count - number of times tag has been used
 * @field name - the tag name/title
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    id:           { type: 'uuid', default: { '$db_function': 'uuid()' } },

    count:        'bigint',
    name:         { type: 'list', typeDef: '<text>' },
  },

  key: ['id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  }
}
