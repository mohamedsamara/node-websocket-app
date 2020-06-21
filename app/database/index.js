const mongoose = require('mongoose');

const mongoURI = require('../config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log(`Error connecting to Mongo: ${err}`));

module.exports = mongoose.connection;
