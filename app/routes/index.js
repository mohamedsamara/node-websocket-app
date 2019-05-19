const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const jwt = require('jsonwebtoken');

const keys = require('../config/keys');
const { verifyToken, passAuthenticated } = require('../auth/verify');

// Bring in User Model
let User = require('../models/user');

// login view
router.get('/login', passAuthenticated, (req, res) => {
  res.render('pages/login');
});

// register view
router.get('/register', passAuthenticated, (req, res) => {
  res.render('pages/register');
});

// chat view
router.get('/chat', (req, res) => {
  res.render('pages/chat');
});

// profile view
router.get('/profile', verifyToken, (req, res) => {
  res.render('pages/profile');
});

// homepage view
router.get('/', (req, res) => {
  res.render('pages/index');
});

// register process
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

// login process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })(req, res, next);
});

// logout process
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// 404 not found view
router.get('*', (req, res) => {
  res.render('pages/404Page');
});

// Below is the login implemented by passport JWT Strategy
// router.post('/login', (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//
//   User.findOne({ email }).then(user => {
//     if (!user) {
//       console.log('user', user);
//     }
//     bcrypt.compare(password, user.password).then(isMatch => {
//       if (isMatch) {
//         const payload = { id: user.id, name: user.name };
//         jwt.sign(
//           payload,
//           keys.secretOrKey,
//           { expiresIn: 3600 },
//           (err, token) => {
//             res.status(200).json({
//               success: true,
//               token: token,
//               user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email,
//               },
//             });
//           },
//         );
//       } else {
//         res.status(404).json({
//           success: false,
//           error: 'Password Incorrect',
//         });
//       }
//     });
//   });
// });

module.exports = router;
