var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// serialize and deserialize
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  })
});

// middleware
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passportField: 'passport',
  passReqToCallback: true
}, function (req, email, passport, done) {
  User.findOne( {email: email}, function (err, user) {
    if (err) return next(err);

    if (!user) {
      return done(null, false, req.flash('loginMessage', 'No user has been found'));
    }

    if (!user.comparePassword(passport)) {
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password!'));
    }

    return done(null, user);
  });
}));


// custom function to validate
exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}