/**
 *
 * 'channel_live' table schema
 *
 * Defines the schema for the table 'channel_live', which contains
 * all the live streams that have ever taken place, ordered
 * by when the stream started
 *
 * @key PRIMARY - 'start_time' allows for the data to be ordered
 * by when a stream started, descending. This allows for easy retrieval
 * of the latest stream a user has created, while also allowing querying
 * of streams back in time that are no longer live.
 *
 * @field
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    channel_id:             'uuid',
    is_live:                'boolean',

    // CLUSTERING COLUMN
    start_time:             { type: 'timestamp', default: { '$db_function': 'toTimestamp(now())' } },

    stop_time:              'timestamp',
    live_view_count:        'bigint',
    bucket:                 { type: 'list', typeDef: '<text>' },
    rank:                   { type: 'double', default: 0.0 },
    alias:                  { type: 'list', typeDef: '<text>'  },
    name:                   { type: 'list', typeDef: '<text>' },
    title:                  { type: 'list', typeDef: '<text>' },
    influence:              { type: 'int', default: 0 },
    tags:                   { type: 'set', typeDef: '<text>' }
  },

  key: [['channel_id', 'is_live'], 'start_time'],

  // Index is used temporarily for following live querying,
  // which should be replaced with a tenable solution
  indexes: ['is_live'],

  // This is a time series table, so it keeps track of every live
  // stream that has occurred (excluding those expired by TTL)
  clustering_order: { 'start_time': 'desc' },

  // Materialized views allow us to query and/or sort by
  // different columns
  materialized_views: {

    // Query by rank
    stream_by_rank: {
      select:               ['title', 'name', 'alias', 'live_view_count', 'influence'],
      key:                  ['is_live', 'rank', 'channel_id', 'start_time'],
      clustering_order:     { 'rank': 'desc' }
    },
  }
}
