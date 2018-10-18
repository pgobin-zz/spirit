/**
 *
 * 'video' table schema
 *
 * Defines the schema for the table 'video', which contains
 * all the videos that have ever been recorded from live streams
 * or uploaded.
 *
 * @field
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    // //Can default to database function because it is not
    // //tied to another entity in any way. Unlike the channel and
    // //user tables, which require UUID generation on the business layer
    // //because user must point to channels with the same ID.
    //// Must not default to a database function because counters
    //// and potentially other data must exist in a separate table
    id:             { type: 'uuid', default: { '$db_function': 'uuid()' } },

    title:          { type: 'list', typeDef: '<text>' },
    tags:           { type: 'list', typeDef: '<text>' },
    channel_alias:  { type: 'list', typeDef: '<text>' },
    channel_name:   { type: 'list', typeDef: '<text>' },
    channel_id:     'uuid'
  },

  key: ['id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  }
}
