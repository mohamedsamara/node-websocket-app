const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const db = require('./app/config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

// set public folder
app.use(express.static(path.join(__dirname, 'app/public')));

// EJS engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});
