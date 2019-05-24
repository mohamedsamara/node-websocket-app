const Message = require('../models/message');

exports = module.exports = function(io) {
  io.on('connection', socket => {
    console.log('websocket connected!');

    socket.on('typing', data => {
      // io.broadcast.emit('typing', data);

      socket.broadcast.emit('typing', data);

      // io.sockets.emit('typing', data);
    });

    socket.on('new message', data => {});

    socket.on('disconnect', () => {
      console.log('websocket disconnected!');
    });
  });
};
