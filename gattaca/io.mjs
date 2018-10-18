import socketio from 'socket.io'
import bluebird from 'bluebird'
import jwt from 'jsonwebtoken'
import { server, secret } from './config'
import * as actions from './actions'



const verify = bluebird.promisify(jwt.verify)
const io = socketio(server)



/**
 *
 *
 *
 * @param socket
 * @param next
 *
 */
const validateToken = async (socket, next) => {
  if (!socket.handshake.query) {
    return next(new Error('Unsupported handshake.'))
  }

  if (!socket.handshake.query.token) {
    return next(new Error('Unsupported handshake.'))
  }

  const token = socket.handshake.query.token


  // * (1) Validate JWT
  // JWT provided in query object

  let decoded
  try {
    decoded = await verify(token, secret)
  } catch (error) {
    next(new Error('Error verifying token.'))
  }

  if (!decoded) {
    return next(new Error('Unable to authenticate.'))
  }


  // * (2) Put token in socket object
  // Used to extract alias, etc.

  socket.decoded = decoded
  return next()
}



io.use(validateToken)


io.on('connection', (socket) => {
  console.log('New connection...')
  socket.on('join_room', actions.joinRoom.bind(null, socket))
  socket.on('message', actions.message.bind(null, socket))
})



export default io
