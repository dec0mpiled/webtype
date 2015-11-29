var express = require('express');
var router = express.Router();
var Document = require('../models/document');

router.get('/:id', function (req, res) {
  Document.findOneAndRemove({ _id: req.params.id }, function(err, document) {
    if (err) throw err;
    res.redirect('/');
  });
});


module.exports = router;