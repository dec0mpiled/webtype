var express = require('express');
var router = express.Router();

// models
var Document = require('../models/document');

// local dependencies
var slug = require('slug');

//----------------------------------------------------------------------------//
// DOCUMENT                                                                   //
//----------------------------------------------------------------------------//

// document creation

// create new doc
router.get('/d', ensureAuthentication, function (req, res, next) {
  Document.create({
    _user: req.user.id,
    draft: true,
    archived: false,
    date: {
        created: new Date,
        edited: new Date
    }
  }, function (err, document) {
    if (err) return next(err);
    res.redirect('/e/d/' + document.id);
  });
});

// document sharing

// fork and edit
router.get('/d/:id/f/:user', function (req, res, next) {
  Document.findOne({ _id: req.params.id }, function (err, document) {
    if (err) return next(err);
    Document.create({
      _origin_author: document._user,
      _origin_id: document._id,
      _user: req.user.id,
      draft: true,
      date: {
        created: new Date,
        edited: new Data
      }
    }, function (err, doc) {
      if (err) return next(err);
      res.redirect('/e/d/' + doc.id);
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
