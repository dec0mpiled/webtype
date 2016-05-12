var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var auth = express.Router();
var md5 = require('md5');

auth.get('/register', function(req, res) {
  res.render('a/register', { active: 'register', title: 'Register' });
});

auth.post('/register', function(req, res, next) {
  Account.register(new Account({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    md5: md5(req.body.email)
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render("a/register", {
        info: "username already exists!",
        active: 'register'
      });
    }

    passport.authenticate('local')(req, res, function() {
      req.session.save(function(err) {
        if (err) return next(err);
        res.redirect('/create');
      });
    });
  });
});


auth.get('/login', function(req, res) {
  res.render('a/login', {
    user: req.user,
    active: 'login',
    title: 'Login'
  });
});

auth.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render("a/login", { info: "username and password do not match!", active: 'login', title: 'Login' }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

auth.get('/logout', function(req, res, next) {
  req.logout();
  req.session.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// update
auth.post('/update', function (req, res, next) {
  Account.findOneAndUpdate({ _id: req.user.id }, {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username
  }, function (err, account) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = auth;
