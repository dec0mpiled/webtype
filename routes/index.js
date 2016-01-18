var express = require('express');
var router = express.Router();

// models
var Document = require('../models/document');
var Account = require('../models/account');

// home screen (doc list, user login)
router.get('/', function (req, res) {
    if (!req.user) {
        res.render('index', {
            user : req.user,
            title: 'owebbot',
            active: 'home'
        });
    } else {
        Document.find({ '_user' : req.user._id }, null, { sort: '-date.edited' }, function (err, documents) {
            if (err) throw err;
            res.render('index', {
                user : req.user,
                document: documents,
                title: 'owebbot',
                active: 'home'
            });
        });
    }
});

// doc view
router.get('/@:user/:slug', function (req, res, next) {
  Account.findOne({ username: req.params.user }, function(err, account) {
    if (err) return next(err);
    Document.findOne({ '_user': account._id, 'slug': req.params.slug }, function (err, document) {
      if (err) return next(err);
      res.render('d/view', {
        title: document.title,
        document: document,
        account: account
      });
    });
  });
});

// unnamed view
router.get('/~:id', function (req, res, next) {
  Document.findOne({ _id: req.params.id }, function (err, document) {
    if (err) return next(err);
    Account.findOne({ username: document.author }, function(err, account) {
      if (err) return next(err);
      res.render('d/view', {
        title: document.title,
        document: document,
        account: account
      });
    });
  });
});

// user view (todo: show docs)
router.get('/@:user', function (req, res, next) {
  Account.findOne({ username: req.params.user }, function (err, result) {
    if (err) return next(err);
    if (!result) {
      res.redirect('/');
    }
    Document.find({ '_user': result._id, 'draft': false }, function (err, document) {
      if (err) return next(err);
      res.render('a/profile', {
        result: result,
        user: req.user,
        document: document
      });
    });
  });
});

// Ensure Authentication
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/auth/login');
  }
}

module.exports = router;
