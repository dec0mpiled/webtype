var express = require('express');
var router = express.Router();

// models
var Document = require('../models/document');

// local dependencies
var slug = require('slug');
var marked = require('marked');

//----------------------------------------------------------------------------//
// DOCUMENT                                                                   //
//----------------------------------------------------------------------------//

// edit doc
router.get('/d/:id', ensureAuthentication, function (req, res) {
  Document.findOne({ _id: req.params.id }, function (err, document) {
    if (err) throw err;
    res.render('d/edit', {
      user: req.user,
      document: document
    });
  });
});

// autosave
router.post('/d/as/:id', ensureAuthentication, function (req, res) {
  Document.findOneAndUpdate({ _id: req.params.id }, {
    slug: slug(req.body.title, { lower: true, remove: /[.]/g }),
    content: {
      title: req.body.title,
      data: {
        raw: req.body.content,
        html: marked(req.body.content)
      }
    },
    date: {
      edited: new Date
    }
  }, function (err, document) {
    if (err) throw err;
    res.send({ document: document });
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
