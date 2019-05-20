const Mongoose = require('mongoose');

const { Schema } = Mongoose;

// Conversation Schema
const ConversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = Mongoose.model('Conversation', ConversationSchema);
