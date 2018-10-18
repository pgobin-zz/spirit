/**
 *
 *
 * 'alias_count' table schema
 *
 *
 * Defines the schema for the table 'alias_count', which contains
 * all the compact names ever registed and the number of other
 * users who have signed up with the same compact name
 *
 * @key compact_name - primary key
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    // Required to be this because Cassandra doesn't allow counter
    // types to exist beside columns of different types that aren't
    // the primary key

    compact_name:   'text',

    count:          'counter'
  },

  key: ['compact_name'],
}
