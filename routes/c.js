var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var List = require('../models/list');

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

// create list
router.get('/l', function (req, res) {
  List.create({
    user: req.user,
    date: {
        created: new Date,
        edited: new Date
    }
  }, function (err, list) {
    if (err) throw err;
    res.redirect('/e/l/' + list.id);
  });
});

module.exports = router;
