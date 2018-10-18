import jwt from 'jsonwebtoken'
import bluebird from 'bluebird'
import expressJwt from 'express-jwt' // TODO: maybe remove
import { schema } from '../schema'
import { secret } from '../config'



const sign = bluebird.promisify(jwt.sign)



/**
 *
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
export const createToken = async (req, res, next) => {
  // if (res.locals.message && !res.locals.updateToken) {
  //   return schema(res, 200, res.locals.message)
  // }

  if (!res.locals.jwtParams) return next()

  const params = res.locals.jwtParams
  let storm, gattaca


  try {
    storm = await sign(params.payload, secret, params.options)
    gattaca = await sign({ alias: params.payload.alias }, secret, params.options)
  } catch (error) {
    return schema(res, 500, 'Error signing tokens.')
  }


  // * () Split Storm JWT into two cookies
  // Split 'Storm' JWT into HTTPOnly and standard cookie
  // 'Storm' is the token that authenticates against the API

  let expand = storm.slice().split('.')
  let signature = expand.splice(2).join()
  let headerAndPayload = expand.join('.')

  let options = { maxAge: 9e8, secure: false }
  res.cookie('app-auth-header-payload', headerAndPayload, options)
  options = { maxAge: 9e8, httpOnly: true, secure: false }
  res.cookie('app-auth-signature', signature, options)


  // * () Put Gattaca JWT into cookie
  // 'Gattaca' is the token that authenticates against chat
  // Stored in a standard cookie. This is for added security,
  // variability of claims and to allow the API token to be split.

  options = { maxAge: 9e8, secure: false }
  res.cookie('app-auth-gattaca', gattaca, options)


// * () Put refresh token into cookie
  // Send refresh token on sign up or login
  // Refreshing a token or getting a new one from editing your
  // alias does not generate a new refreshToken
  if (params.refreshToken) {
    options = { maxAge: 9e8, httpOnly: true, secure: false }
    res.cookie('app-auth-refresh', params.refreshToken, options)
  }


  // This means the first middleware specified the request
  // to end here, so respond and send the token.
  // Otherwise another middleware would send the response

  if (res.locals.message) {
    return schema(res, 200, res.locals.message)
  }

  return next()
}



/**
 *
 *
 *
 * @param req
 * @param res
 * @param next
 *
 */
export const refreshToken = async (err, req, res, next) => {
  // console.log('UMM?')

  // No token was found so continue. If the request requires
  // authorization, then the requiresUser middleware will end it

  if (!req.token) return next()

  // If there is a token and it's not invalid then no
  // need to refresh so skip middleware

  if (err && err.code !== 'invalid_token') return next()


  // TODO: maybe move header
  // * (1) Get refresh token from cookie
  // Get refresh token string from cookie and shove it in
  // a string so we can validate against it

  let refreshToken
  const items = req.headers.cookie
    .split(';')
    .map(item => {
      if (item.includes('app-auth-refresh')) {
        refreshToken = item.split('=')[1].trim()
      }
    })


  // If no refresh token and since the token is invalid,
  // we respond with a 401

  if (!refreshToken) return schema(res, 401, 'No refresh token.')


  // Decode invalid token to get user ID so we don't have to
  // do more work than required

  let decoded = jwt.decode(req.token);
  let userIdFromToken = decoded.id
  console.log(userIdFromToken)


  // From the token, we should now have the user id to
  // query the database to match the provided refresh token.
  // If the token matches, then we can safely refresh it.

  let user
  try {
    user = await cassa.instance.user.findOneAsync({
      id: datatypes.Uuid.fromString(userIdFromToken)
    })
  } catch (error) {
    return schema(res, 500, 'Error querying user for token.')
  }

  if (!user) return schema(res, 401, 'User doesn\'t exist.')
  if (user.refresh_token !== refreshToken) {
    return schema(res, 401, 'Invalid token.')
  }


  // If we've reached this point, we can be assured that the user
  // is who they say they are because the refresh tokens match
  let payload = decoded // ?

  // let payload = { email: user.email, alias: alias, id: userId,
  //   channelId: channelId  }
  let options = { expiresIn: process.env.JWT_EXPIRY }

  res.locals.jwtParams = { payload, options }
  // createToken()

  // ? Is this hacky
  req.user = payload
  return next()
}


/**
 *
 *
 * Construct and validate jwt from two separate cookies included in
 * request. 'expressJwt' automatically handles the validation and is
 * provided the secret used to verify the validity of the jwt.
 *
 *
 */
export const validateToken = () => {
  return expressJwt({
    getToken: function fromHeaderOrQuerystring (req) {
      if (!req.headers.cookie) return;
      let headerPayload, signature, token = null

      // Search cookie for both auth cookies
      const items = req.headers.cookie.split(';').map(item => {
        if (item.includes('app-auth-signature')) {
          signature = item.split('=')[1].trim()
        }
        if (item.includes('app-auth-header-payload')) {
          headerPayload = item.split('=')[1].trim()
        }
      })

      // Create token from HTTPOnly and standard cookie
      if (headerPayload && signature) {
        token = headerPayload + '.' + signature
      }

      // Needed for token refresh middleware
      // TODO: Only have access to req... figure out better way
      req.token = token

      return token
    },

    // Secret used to validate jwt. Cannot change.
    secret: secret,

    // Effectively makes validateToken() a pass-through
    // function that adds req.user, which is used to
    // validate the user.
    //
    // If true, this middleware will throw when no Jwt
    // and block unauthenticated users.
    credentialsRequired: false,
  })
}
