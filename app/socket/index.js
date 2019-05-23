const Message = require('../models/message');

exports = module.exports = function(io) {
  io.on('connection', socket => {
    console.log('websocket connected!');

    socket.on('new message', data => {
      const reply = new Message({
        conversationId: data.conversationId.toString(),
        body: data.body,
        sender: data.sender.toString(),
      });

      reply.save((err, sentReply) => {
        if (err) {
        }

        Message.find({ conversationId: data.conversationId })
          .select('createdAt body sender')
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: 'sender',
            select: 'name username',
          })
          .exec((err, messages) => {
            if (err) {
            }
            io.sockets.emit('new message', messages);
          });
      });
    });

    socket.on('disconnect', () => {
      console.log('websocket disconnected!');
    });
  });
};
