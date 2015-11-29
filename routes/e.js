var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var List = require('../models/list');

var slug = require('slug');
var marked = require('marked');

// edit doc
router.get('/d/:id', function (req, res) {
  Document.findOne({ _id: req.params.id }, function (err, document) {
    if (err) throw err;
    res.render('edit', {
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
    console.log(document);
    res.send({ document: document });
  });
});

// show list
router.get('/l/:id', function (req, res) {
  List.findOne({ _id: req.params.id }, function (err, list) {
    if (err) throw err;
    res.render('list', {
      user: req.user,
      list: list
    });
  });
});

// push to list
router.post('/l/a/:id', function (req, res) {
  List.findOne({ _id: req.params.id }, function (err, list) {
    if (err) throw err;
    list.item.push({ content: req.body.content, date: { created: new Date, edited: new Date } });
    list.save(function (err) {
      if (err) throw err;
      res.send({ status: 'success' });
    });
  });
});

// shift from list
router.get('/l/s/:id/:sub')

module.exports = router;
