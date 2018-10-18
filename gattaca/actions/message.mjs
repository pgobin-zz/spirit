import io from '../io'



/**
 *
 *
 *
 *

 * @param socket
 * @param data
 *
 */
export const message = (socket, data) => {
  console.log(data)

  if (!data) {
    return next(new Error('Unsupported join request.'))
  }

  if (!data.from || !data.message || !data.channelId) {
    return next(new Error('Unsupported join request.'))
  }

  io.to(data.channelId).emit('message', data)
}
