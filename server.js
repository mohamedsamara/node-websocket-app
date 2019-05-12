require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const db = require('./app/config/keys').mongoURI;
const routes = require('./app/routes');

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true },
  )
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

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// require('./app/auth/passportJwt')(passport);
require('./app/auth/passportLocal')(passport);

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});
