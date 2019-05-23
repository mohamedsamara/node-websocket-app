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
const ioServer = require('./app/socket');

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true },
  )
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

let server;
server = app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

const io = require('socket.io').listen(server);

ioServer(io);

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
    cookie: {
      expires: 600000,
    },
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Below is the setup for passport Local Strategy
require('./app/auth/passportLocal')(passport);

// Below is the setup for passport JWT Strategy
// require('./app/auth/passportJwt')(passport);

// inject user data in all templates
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use('/', routes);
