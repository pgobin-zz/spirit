import passport from 'passport'
import Strategy from 'passport-local'
import { cassa } from '../config'
import { verifyPassword } from './password'



/**
 *
 *
 * Authenticate user on login
 *
 * Two lookups is a calculated tradeoff
 *
 *
 * @param email
 * @param password
 * @param done
 */
const validateUser = async (email, password, done) => {

  // * (1) Lookup user by email
  // Lookup table used due to strict guarantee and performance
  // requirements as it relates to password hashing and others

  let lookup
  try {
    lookup = await cassa.instance.email.findOneAsync({
      email: email
    })
  } catch (error) {
    return done('Error querying lookup.', null)
  }
  if (!lookup) return done(null, null)


  // * (2) Get user info
  // ` "It is known, Khaleesi."

  let user
  try {
    user = await cassa.instance.user.findOneAsync({
      id: lookup.user_id // already uuid
    })
  } catch (error) {
    return done('Error querying user.', null)
  }


  // In case an email exists but account creation
  // failed after the reservation.
  if (!user) return done(null, null)


   // * (2) Validate password

  const ok = await verifyPassword(password, user.hash, user.salt)
  if (ok === false) return done(null, null)
  if (ok === null) return done('Error verifying password', null)


  // * (3) Hydrate req.user
  // On success, the following subset of the user object
  // is passed down the middleware pipeline in req.user. If
  // authentication fails above, req.user is null and the
  // requiresUser() middleware will respond with a 401 if it is
  // part of a route's middleware pipeline.

  return done(null, {
    id: user.id,
    email: user.email[0],
    alias: user.aliases[0],
    channelId: user.channels[0]
  })
}



const options = { usernameField: 'email' }
passport.use(new Strategy(options, validateUser))

export default passport
