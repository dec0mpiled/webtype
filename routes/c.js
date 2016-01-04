var express = require('express');
var router = express.Router();

var slug = require('slug');

// models
var Document = require('../models/document');
var Blog = require('../models/blog');

//----------------------------------------------------------------------------//
// BLOG                                                                       //
//----------------------------------------------------------------------------//

// create new blog
router.get('/b', ensureAuthentication, function (req, res) {
  Blog.create({
    user: req.user,
    date: {
      created: new Date,
      edited: new Date
    }
  }, function (err, blog) {
    if (err) throw err;
    res.redirect('/e/b/' + blog.id);
  });
});

//----------------------------------------------------------------------------//
// DOCUMENT                                                                   //
//----------------------------------------------------------------------------//

// create new doc
router.get('/d', ensureAuthentication, function (req, res) {
  Document.create({
    user: req.user,
    content: {
      title: 'new draft'
    },
    date: {
        created: new Date,
        edited: new Date
    }
  }, function (err, document) {
    if (err) throw err;
    res.redirect('/e/d/' + document.id);
  });
});

// create a new doc in blog
router.get('/d/in/b/:id', ensureAuthentication, function (req, res) {
  Document.create({
    user: req.user,
    slug: slug('new post', { lower: true, remove: /[.]/g }),
    content: {
      title: 'new post'
    },
    blog: req.params.id,
    date: {
      created: new Date,
      edited: new Date
    }
  }, function (err, document) {
    if (err) throw err;
    res.redirect('/c/a/d/' + document.id + '/to/b/' + req.params.id);
  });
});

// add doc to blog
router.get('/a/d/:doc/to/b/:blog', function (req, res) {
  Blog.findOne({ _id: req.params.blog }, function (err, blog) {
    blog.post.addToSet(req.params.doc);
    blog.save(function(err) {
      if (err) throw err;
      res.redirect('/e/d/' + req.params.doc);
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
