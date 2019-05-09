const express = require('express');
const router = express.Router();

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

// homepage view
router.get('/', (req, res) => {
  res.render('pages/index');
});

// 404 not found view
router.get('*', (req, res) => {
  res.render('pages/404Page');
});

module.exports = router;
