const Mongoose = require('mongoose');

const { Schema } = Mongoose;

// Message Schema
const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Mongoose.model('Message', MessageSchema);
