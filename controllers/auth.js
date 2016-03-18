var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;

var jwt  = require('jwt-simple');

var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var config = require('../config.json');

var JwtStrategy = require('passport-jwt').Strategy;

// load up the user model


/**module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};**/

passport.use(new BasicStrategy(
  function(username, password, callback) {

    User.findOne({ username: username }, function (err, user) {
      console.log("hey hey hey  " + user);
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success

        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false});
