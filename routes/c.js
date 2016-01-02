var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var Blog = require('../models/blog');

// create new blog
router.get('/b', function (req, res) {
  Blog.create({
    user: req.user,
    title: req.body.title,
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
router.get('/d', function (req, res) {
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

module.exports = router;
