var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var fs = require('fs');
// load the auth variables
var configAuth = require('./auth');
// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
  fs.readFile('users.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    JSON.parse(data).forEach(function (user) {
      if (user.id === id) {
        done(err, user);
      }
    })
  })
});

passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function (token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function () {

      // try to find the user based on their google id
      fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
          throw err;
        }
        var users = JSON.parse(data);
        users.forEach(function (user) {
          if (user.id == profile.id) {
            // if a user is found, log them in
            return done(null, user);
          } else {
            var newUser = {};
            // set all of the relevant information
            newUser.id = profile.id;
            newUser.token = token;
            newUser.name = profile.displayName;
            newUser.email = profile.emails[0].value; // pull the first email
            // save the user
            users.push(newUser);
            fs.writeFile('users.json', JSON.stringify(users), {"encoding": 'utf8'}, function (e) {
              if (e) {
                throw e;
              }
              return done(null, newUser);
            })
          }
        });
      });
    });
  }));
passport.use(new FacebookStrategy({
    clientID: configAuth.facebook.clientID,
    clientSecret: configAuth.facebook.clientSecret,
    callbackURL: configAuth.facebook.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  function (token, refreshToken, profile, done) {
    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function () {

      // try to find the user based on their google id
      fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
          throw err;
        }
        var users = JSON.parse(data);
        users.forEach(function (user) {
          if (user.id == profile.id) {
            // if a user is found, log them in
            return done(null, user);
          } else {
            var newUser = {};
            // set all of the relevant information
            newUser.id = profile.id;
            newUser.token = token;
            newUser.name = profile.displayName;
            newUser.email = profile.emails[0].value; // pull the first email

            // save the user
            users.push(newUser);
            fs.writeFile('users.json', JSON.stringify(users), {"encoding": 'utf8'}, function (e) {
              if (e) {
                throw e;
              }
              return done(null, newUser);
            })
          }
        });
      });
    });

  }));
module.exports = passport;