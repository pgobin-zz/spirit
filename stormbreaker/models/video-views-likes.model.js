/**
 *
 *
 * 'video_views_likes' table schema
 *
 *
 * Defines the schema for the table 'video_views_likes', which contains
 * the likes and views as counter columns for a video
 *
 * @key PRIMARY
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    // Required to be this because Cassandra doesn't allow counter
    // types to exist beside columns of different types that aren't
    // the primary key

    id:       'uuid',

    likes:          'counter',
    views:          'counter'
  },

  key: ['id'],
}
