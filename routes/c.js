var express = require('express');
var router = express.Router();

var slug = require('slug');

// models
var Document = require('../models/document');
var Blog = require('../models/blog');

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
  Blog.findOne({ _id: req.params.id }, function (err, blog) {
    if (err) throw err;
    Document.create({
      user: req.user,
      slug: slug('new post in ' + blog.title, { lower: true, remove: /[.]/g }),
      content: {
        title: 'new post in ' + blog.title
      },
      blog: blog,
      date: {
        created: new Date,
        edited: new Date
      }
    }, function (err, document) {
      if (err) throw err;
      blog.post.addToSet(document);
      blog.save(function(err) {
        if (err) throw err;
        res.redirect('/e/d/' + document.id);
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
