/**
 *
 *
 * 'auth' table schema
 * ! ONLY update using lightweight transactions
 *
 *
 * Defines the schema for the table 'auth', which contains
 * all taken emails.
 *
 * Used to quickly see if an email is taken.
 *
 * Lightweight transaction is required when updating,
 * which is insurance against concurrency / race scenarios.
 *
 * //Also includes password to assist with quick user
 * //authentication
 *
 * @key PRIMARY
 * The 'email' field must be used instead of an id or
 * compound key because we need to query this table by email.
 *
 * Even though storing more user info here would eliminate
 * the two lookups required for login, I don't want more
 * reponsibility when updating user stuff. Solid tradeoff.
 *
 * Note that materialized views are not used intentionally as
 * they are still too new to adopt in this scenario and have
 * many not-yet-understood limitations.
 *
 *
 * @key PRIMARY
 * 'email' is used as primary key because it ensures that a query
 * only needs that one key to perform the lookup
 *
 */
export default {
  fields: {

    // PRIMARY KEY
    email:          'text',

    // added_time:     { type: 'timestamp', default: { '$db_function': 'toTimestamp(now())' } },
    // password:       '˚text',
    user_id:        'uuid'
  },

  key: ['email'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  }
}
