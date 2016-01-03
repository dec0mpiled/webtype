var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var Blog = require('../models/blog');

router.get('/d/:id', ensureAuthentication, function (req, res) {
  Document.findOneAndRemove({ _id: req.params.id }, function(err, document) {
    if (err) throw err;
    res.redirect('/');
  });
});

router.get('/b/:id', ensureAuthentication, function (req, res) {
  Blog.findOneAndRemove({ _id: req.params.id }, function(err, document) {
    if (err) throw err;
    res.redirect('/');
  })
})

// Ensure Authentication
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/auth/login');
  }
}

module.exports = router;
