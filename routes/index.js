var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var Account = require('../models/account');

router.get('/', function (req, res) {
    if (!req.user) {
        res.render('index', {
            user : req.user,
            title: 'owebbot',
            active: 'home'
        });
    } else {
        Document.find({ 'user._id' : req.user._id }, null, { sort: '-date.edited' }, function (err, documents) {
            if (err) throw err;
            res.render('index', {
                user : req.user,
                document: documents,
                title: 'owebbot',
                active: 'home'
            });
        });
    }
});

router.get('/@:user/:slug', function (req, res) {
    Document.findOne({ 'user.username': req.params.user, 'slug': req.params.slug }, function (err, document) {
        if (err) throw err;
        res.render('view', {
            document: document
        });
    })
});

router.get('/@:user', function (req, res) {
    Account.findOne({ username: req.params.user }, function (err, result) {
       if (err) throw err;
       res.render('profile', {
         result: result,
         user: req.user
       });
    });
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
