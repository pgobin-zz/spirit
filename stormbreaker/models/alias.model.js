/**
 *
 *
 * 'alias' table schema
 * ! ONLY update using lightweight transactions
 *
 *
 * Defines the schema for the table 'alias', which contains
 * all the taken aliases.
 *
 * Used to quickly see if an alias is taken.
 *
 * Lightweight transaction is required when updating,
 * which is insurance against concurrency / race scenarios.
 *
 * If an alias needs to be updated, first the 'alias' table
 * must be updated using a lightweight transaction. Then,
 * the table you need to update can be updated normally.
 *
 * If a user requests a channel by alias (via URL) then
 * the 'alias' table is used as a lookup for the channel ID.
 * The 'alias' table purposefully does not duplicate the
 * channel table (even though that would eliminate a lookup)
 * because this table's primary key is the alias, which means
 * that since a record must be created for each new alias,
 * you would need to first read from the channel table, then
 * put that in this table.
 *
 * Probably would be preferred, and certainly a reasonable tradeoff,
 * but one that requires more code than can be well-understood
 * at this this time. Therefore, the long-term decision is made
 * to keep this table lean.
 *
 * Note that materialized views are not used intentionally as
 * they are still too new to adopt in this scenario and have
 * many not-yet-understood limitations.
 *
 *
 * @key PRIMARY
 * 'alias' is used as primary key because it ensures that a query
 * only needs that one key to perform the lookup
 *
 */
export default {
  fields: {

    // id:             { type: 'uuid', default: { '$db_function': 'uuid()' } },

    // PRIMARY KEY
    alias:          'text',

    // added_time:     { type: 'timestamp', default: { '$db_function': 'toTimestamp(now())' } },
    channel_id:     'uuid', // Should not default to anything
  },

  key: ['alias'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' }
  }
}
