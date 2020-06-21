require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const socketio = require('socket.io');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const database = require('./app/database');
const routes = require('./app/routes');
const socketServer = require('./app/socket');
const sessionSecret = require('./app/config/keys').sessionSecret;

const server = app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

const io = socketio(server);
socketServer(io);

// set public folder
app.use(express.static(path.join(__dirname, 'app/public')));

// EJS engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session
app.use(
  session({
    store: new MongoStore({ mongooseConnection: database }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./app/auth/passportLocal');

// inject user data in templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  req.io = io;
  next();
});

app.use('/', routes);
