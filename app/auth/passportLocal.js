const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    console.log('email', email);

    User.findOne({
      email
    }).then((user) => {
      console.log('user', user);

      if (!user) {
        return done(null, false, { message: 'That email is not registered' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  console.log('=== serialize ... called ===');
  console.log(user); // the whole raw user object!
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('DEserialize ... called');

  User.findById(id, (err, user) => {
    done(err, user);
  });
});
