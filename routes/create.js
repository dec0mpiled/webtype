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
router.get('/', ensureAuthentication, function (req, res, next) {
  Document.create({
    _user: req.user.id,
    title: 'untitled',
    slug: slug('untitled', { lower: true, remove: /[.]/g }),
    draft: true,
    archived: false,
    date: {
        created: new Date,
        edited: new Date
    }
  }, function (err, document) {
    if (err) return next(err);
    res.redirect('/' + req.user.username + '/' + document.id);
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
