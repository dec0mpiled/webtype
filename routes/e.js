var express = require('express');
var router = express.Router();

// models
var Document = require('../models/document');
var Blog = require('../models/blog');

var slug = require('slug');
var marked = require('marked');

//----------------------------------------------------------------------------//
// BLOG                                                                       //
//----------------------------------------------------------------------------//

// edit blog
router.get('/b/:id', ensureAuthentication, function (req, res) {
  Blog.findOne({ _id: req.params.id }, function (err, blog) {
    if (err) throw err;
    Document.find({ '_id': { $in: [blog.post] } }, function (err, doc) {
      if (err) {
        res.render('b/edit', {
          user: req.user,
          blog: blog,
          document: null
        });
      } else {
        res.render('b/edit', {
          user: req.user,
          blog: blog,
          document: doc
        });
      }
    });
  });
});

router.post('/b/:id', ensureAuthentication, function (req, res) {
  Blog.findOneAndUpdate({ _id: req.params.id }, {
    slug: slug(req.body.name, { lower: true, remove: /[.]/g }),
    title: req.body.name,
    date: {
      edited: new Date
    }
  }, function (err, blog) {
    if (err) {
      res.render('b/edit', {
        user: req.user,
        blog: { id: req.params.id },
        error: 'blog name taken'
      });
    } else {
      res.redirect('/e/b/' + blog.id);
    }
  });
});

// add to blog
router.get('/b/:id/ad/:doc', ensureAuthentication, function (req, res) {
  Document.findOneAndUpdate({ _id: req.params.doc }, { blog: req.params.id }, function (err, document) {
    if (err) throw err;
    blog.post.addToSet(req.params.doc);
    blog.save(function(err) {
      if (err) throw err;
      res.redirect('/e/b/' + req.params.id);
    });
  });
});

// remove from blog
router.get('/b/:id/dd/:doc', ensureAuthentication, function (req, res) {
  Document.findOneAndUpdate({ _id: req.params.doc }, { blog: null }, function (err, document) {
    if (err) throw err;
    Blog.findOne({ _id: req.params.id }, function (err, blog) {
      if (err) throw err;

      var pos = blog.post.indexOf(req.params.id);
      blog.post.splice(pos, 1);

      blog.save(function(err) {
        if (err) throw err;
        res.redirect('/e/b/' + req.params.id);
      });

    });
  });
});

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
