module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('websocket connected!');

    socket.on('disconnect', () => {
      console.log('websocket disconnected!');
    });
  });
};
