const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

const keys = require('../config/keys');

// login view
router.get('/login', (req, res) => {
  res.render('pages/login');
});

// register view
router.get('/register', (req, res) => {
  res.render('pages/register');
});

// chat view
router.get('/chat', (req, res) => {
  res.render('pages/chat');
});

router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  let newUser = new User({
    name: name,
    email: email,
    username: username,
    password: password,
  });

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if (err) {
        console.log(err);
      }
      newUser.password = hash;
      newUser.save(function(err) {
        if (err) {
          console.log(err);
          return;
        } else {
          res.redirect('/login');
        }
      });
    });
  });
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      console.log('user', user);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.status(200).json({
              success: true,
              token: token,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
              },
            });
          },
        );
      } else {
        res.status(404).json({
          success: false,
          error: 'Password Incorrect',
        });
      }
    });
  });
});

// router.get(
//   '/logout',
//   passport.authenticate('jwt', { session: false }),
//   function(req, res) {
//     req.logout();
//     res.json({ success: true, msg: 'Sign out successfully.' });
//   },
// );

router.get(
  '/profile',
  passport.authenticate('jwt', {
    session: false,
    successRedirect: '/',
    failureRedirect: '/login',
  }),
  (req, res) => {
    console.log('toto', req.headers.authorization);

    res.json({ user: req.user });
  },
);

// homepage view
router.get('/', (req, res) => {
  res.render('pages/index');
});

// 404 not found view
router.get('*', (req, res) => {
  res.render('pages/404Page');
});

module.exports = router;

// Bring in User Model
let User = require('../models/user');
