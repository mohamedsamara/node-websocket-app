const Message = require('../models/message');

exports = module.exports = function(io) {
  io.on('connection', socket => {
    console.log('websocket connected!');

    socket.on('disconnect', () => {
      console.log('websocket disconnected!');
    });
  });
};
