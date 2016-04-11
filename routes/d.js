var express = require('express');
var router = express.Router();

// models
var Document = require('../models/document');

router.get('/a/:id', ensureAuthentication, function (req, res, next) {
  Document.findOneAndUpdate({ _id: req.params.id }, { archived: true }, function (err, document) {
    if (err) return next(err);
    res.redirect('/a');
  });
});

router.get('/d/:id', ensureAuthentication, function (req, res, next) {
  Document.findOneAndRemove({ _id: req.params.id }, function (err, document) {
    if (err) return next(err);
    res.redirect('/a');
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
