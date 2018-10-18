import SocketIOClient from 'socket.io-client';

const create = () => {

  // Init socket
  const socket = SocketIOClient('http://192.168.0.3:3000');

  // Exposed functions
  const joinRoom = (roomId) => socket.emit('join_room', roomId);
  const createRoom = (roomId) => socket.emit('create_room', { key: roomId });
  const onMessage = (next) => {
    socket.on('comment', (data) => {
      next(data)
    })
  }
  const onNotification = (next) => {
    socket.on('notification', (data) => {
      next(data)
    })
  }
  const sendMessage = (roomId, msg) => socket.emit('comment', { roomKey: roomId, msg: msg });

  return {
    joinRoom,
    createRoom,
    onMessage,
    sendMessage,
    onNotification
  }
}

export default { create }
