const passport = require('passport');

const verifyToken = (req, res, next) => {
  if (req.headers.authorization) {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
      if ((!err || !info) && user) {
        req.user = user;
        return next();
      }
      res.status(401).json({ authenticated: false, message: 'Login expired.' });
    })(req, res, next);
  } else {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }
};

const passAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/profile');
};

module.exports = { verifyToken, passAuthenticated };
