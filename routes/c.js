var express = require('express');
var router = express.Router();
var Document = require('../models/document');

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
