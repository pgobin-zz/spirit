
/**
 *
 *
 *
 *
 * TODO: Why are 2 requests happening on conn?
 * TODO: channel validation
 * @param socket
 * @param data
 *
 */
export const joinRoom = (socket, data) => {
  console.log(data)

  if (!data) {
    return next(new Error('Unsupported join request.'))
  }

  if (!data.channelId) {
    return next(new Error('Unsupported join request.'))
  }

  socket.join(data.channelId)
  socket.emit('notification', `Welcome, ${socket.decoded.alias}`)
}
