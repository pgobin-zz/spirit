import ExpressCassandra from 'express-cassandra'
import * as models from './models'



/**
 *
 *
 *
 *
 */
const client = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
    protocolOptions: { port: process.env.CASSANDRA_PORT },
    keyspace: process.env.CASSANDRA_KEYSPACE
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'NetworkTopologyStrategy',
      DC1: '1'
    },
    migration: process.env.CASSANDRA_SCHEMA_MIGRATION,
  }
})



/**
 *
 *
 *
 * @param name
 * @param error
 * @param result
 *
 */
const out = (name, error, result) => {
  if (result) console.log(`\x1b[33mMigration: '${name}' schema updated.`)
  if (!error) return

  switch (error.name) {

    // Failed to read table schema. If this happens, there's
    // probably a connection issue with Cassandra. Check that
    // it's actually running. :)
    case 'apollo.model.tablecreation.dbschemaquery':
      console.error(`\n\x1b[47m\x1b[30m${error.message}\x1b[0m`)
      console.log('\n\x1b[32mIs the database running?\x1b[0m\n')
      process.exit(1)
      break
    default:
      console.error(error)
      break
  }
}



/**
 *
 */
client.loadSchema('alias_count',        models.AliasCount)        .syncDB(out.bind(this, 'alias_count'))
client.loadSchema('alias',              models.Alias)             .syncDB(out.bind(this, 'alias'))
client.loadSchema('email',              models.Email)             .syncDB(out.bind(this, 'email'))
client.loadSchema('channel_following',  models.ChannelFollowing)  .syncDB(out.bind(this, 'channel_following'))
client.loadSchema('channel_subscribed', models.ChannelSubscribed) .syncDB(out.bind(this, 'channel_subscribed'))
client.loadSchema('channel',            models.Channel)           .syncDB(out.bind(this, 'channel'))
client.loadSchema('recommended',        models.Recommended)       .syncDB(out.bind(this, 'recommended'))
client.loadSchema('stream',             models.Stream)            .syncDB(out.bind(this, 'stream'))
client.loadSchema('tag',                models.Tag)               .syncDB(out.bind(this, 'tag'))
client.loadSchema('user',               models.User)              .syncDB(out.bind(this, 'user'))
client.loadSchema('video_views_likes',  models.VideoViewsLikes)   .syncDB(out.bind(this, 'video_views_likes'))
client.loadSchema('video',              models.Video)             .syncDB(out.bind(this, 'video'))



export default client
