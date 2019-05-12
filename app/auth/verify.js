const passport = require('passport');

function isAuth(req, res, next) {
  if (req.headers.authorization) {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
      if ((!err || !info) && user) {
        req.user = user;
        return next();
      }
      res.status(401).json({ authenticated: false, message: 'Login expired.' });
    })(req, res, next);
  } else {
    if (req.isAuthenticated()) return next();

    res.status(401).json({ authenticated: false });
  }
}

module.exports = isAuth;
