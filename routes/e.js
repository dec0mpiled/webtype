var express = require('express');
var router = express.Router();
var Document = require('../models/document');

var slug = require('slug');
var marked = require('marked');

// edit blog
router.get('/b/:id', function (req, res) {
  Blog.findOne({ _id: req.params.id }, function (err, blog) {
    if (err) throw err;
    res.render('b/edit', {
      user: req.user,
      blog: blog
    });
  });
});

// edit doc
router.get('/d/:id', function (req, res) {
  Document.findOne({ _id: req.params.id }, function (err, document) {
    if (err) throw err;
    res.render('d/edit', {
      user: req.user,
      document: document
    });
  });
});

// autosave
router.post('/d/as/:id', function (req, res) {
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

module.exports = router;
