var express = require('express');
var remove = express.Router();

// models
var Document = require('../models/document');

// archive
remove.get('/a/:id', ensureAuthentication, function (req, res, next) {
  Document.findOneAndUpdate({ _id: req.params.id }, { archive: true }, function (err, document) {
    if (err) return next(err);
    res.redirect('/' + req.user.username);
  });
});

// revert
remove.get('/r/:id', ensureAuthentication, function (req, res, next) {
  Document.findOneAndUpdate({ _id: req.params.id }, { archive: false }, function (err, document) {
    if (err) return next(err);
    res.redirect('/' + req.user.username);
  });
});

remove.get('/d/:id', ensureAuthentication, function (req, res, next) {
  Document.findOneAndRemove({ _id: req.params.id }, function (err, document) {
    if (err) return next(err);
    res.redirect('/' + req.user.username);
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

module.exports = remove;
