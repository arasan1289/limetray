var express = require('express');
var router = express.Router();
var fs = require('fs');
var passport = require('../config/passport');

router.get('/users', function (req, res) {
  fs.readFile('users.json', 'utf8', function (err, data) {
    if (err) {
      res.send(err);
    }
    res.send(JSON.parse(data));
  })
});
router.post('/login', function (req, res) {
  fs.readFile('users.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    var users = JSON.parse(data);
    users.forEach(function (user) {
      if (user.email === req.body.email && user.password === req.body.password) {
        res.send({message: "Successfully logged in"})
      } else {
        res.sendStatus(401);
        res.send({message: "Incorrect credentials"});
      }
    })
  });
});
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  approvalPrompt: 'force'
}));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '#/home'
  }), function (req, res) {
    res.redirect('http://hidden-castle-48503.herokuapp.com/#/confirmation')
  });
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}));

// the callback after google has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '#/home'
  },function(req,res){
    res.redirect('http://hidden-castle-48503.herokuapp.com/#/confirmation')
  }));

module.exports = router;
