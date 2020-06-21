const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');

const { verifyToken, passAuthenticated } = require('../auth/verify');

// Bring in Models
const User = require('../models/user'),
  Conversation = require('../models/conversation'),
  Message = require('../models/message');

// login view
router.get('/login', passAuthenticated, (req, res) => {
  res.render('pages/login');
});

// register view
router.get('/register', passAuthenticated, (req, res) => {
  res.render('pages/register');
});

// get all recipients
router.post('/recipients', verifyToken, (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      return res.json(users);
    }
  });
});

// all chats view
router.get('/chats', verifyToken, (req, res) => {
  Conversation.find({ participants: req.user._id })
    .select('_id')
    .exec((err, conversations) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      const fullConversations = [];

      if (conversations.length > 0) {
        conversations.forEach((conversation) => {
          Message.find({ conversationId: conversation._id })
            .sort('-createdAt')
            .limit(1)
            .populate({
              path: 'sender',
              select: 'name username'
            })
            .exec((err, message) => {
              if (err) {
                res.send({ error: err });
                return next(err);
              }
              fullConversations.push(message);
              if (fullConversations.length === conversations.length) {
                res.render('pages/chats', {
                  conversations: fullConversations,
                  moment: moment
                });
              }
            });
        });
      } else {
        res.render('pages/chats', {
          conversations: fullConversations
        });
      }
    });
});

// add chat view
router.get('/chat/add', verifyToken, (req, res) => {
  res.render('pages/add-chat');
});

// reply on a single chat
router.post('/chat/reply/:id', verifyToken, (req, res, next) => {
  const reply = new Message({
    conversationId: req.params.id,
    body: req.body.message,
    sender: req.user._id
  });

  reply.save((err, sentReply) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    Message.find({ conversationId: req.params.id, _id: sentReply._id })
      .select('createdAt body sender')
      .populate({
        path: 'sender',
        select: 'name username'
      })
      .exec((err, messages) => {
        if (err) {
          console.log(err);
        }
        res.status(204).send();
        req.io.sockets.emit('new message', messages);
      });
  });
});

// single chat view
router.get('/chat/:id', verifyToken, (req, res, next) => {
  Message.find({ conversationId: req.params.id })
    .select('createdAt body sender')
    .sort('createdAt')
    .populate({
      path: 'sender',
      select: 'name username'
    })
    .exec((err, messages) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      res.render('pages/chat', {
        conversations: messages,
        conversationId: req.params.id
      });
    });
});

// create single chat
router.post('/chat/new', verifyToken, (req, res, next) => {
  if (!req.body.recipient) {
    res
      .status(422)
      .send({ error: 'Please choose a valid recipient for your message.' });
    return next();
  }

  if (!req.body.message) {
    res.status(422).send({ error: 'Please enter a message.' });
    return next();
  }

  const conversation = new Conversation({
    participants: [req.user._id, req.body.recipient]
  });

  conversation.save((err, newConversation) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    const message = new Message({
      conversationId: newConversation._id,
      body: req.body.message,
      sender: req.user._id
    });

    message.save((err, newMessage) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      return res.status(200).json({
        message: 'Conversation started!',
        conversationId: conversation._id
      });
    });
  });
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
    password: password
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }
      newUser.password = hash;
      newUser.save((err) => {
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
    failureRedirect: '/login'
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

module.exports = router;
