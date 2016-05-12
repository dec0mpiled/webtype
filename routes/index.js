var express = require('express');
var index = express.Router();
var slug = require('slug');

// models
var Document = require('../models/document');
var Account = require('../models/account');

// home screen (doc list, user login)
index.get('/', function(req, res) {
  if (!req.user) {
    res.render('index', {
      user: req.user,
      title: 'webtype',
      active: 'home'
    });
  } else {
    Document.find({
      '_user': req.user._id,
      'archive' : false
    }, null, {
      sort: '-date.edited',
      limit: 5
    }, function(err, documents) {
      if (err) return res.redirect('/' + req.user.username);
      if (documents.length > 0) {
        return res.redirect('/' + req.user.username + '/' + documents[0].slug);
      } else {
        return res.redirect('/' + req.user.username);
      }
    });
  }
});

// create new doc
index.get('/create', ensureAuthentication, function (req, res, next) {
  Document.create({
    _user: req.user._id,
    title: 'untitled',
    slug: slug('untitled', { lower: true, remove: /[.]/g }),
    draft: true,
    archive: false,
    date: {
        created: new Date,
        edited: new Date
    }
  }, function (err, document) {
    if (err) return res.redirect('/');
    res.redirect('/' + req.user.username + '/' + document.slug);
  });
});

// user view
index.get('/:user', function(req, res, next) {
  Account.findOne({
    username: req.params.user
  }, function(err, result) {
    if (err) return next(err);
    if (!result) return res.redirect('/');
    Document.find({
      '_user': result._id
    }, null, { sort: '-date.edited' }, function(err, document) {
      if (err) return next(err);
      res.render('a/profile', {
        result: result,
        user: req.user,
        document: document,
        documents: document,
        title: result.username
      });
    });
  });
});

// doc view
index.get('/:user/:slug', function(req, res, next) {
  Account.findOne({
    username: req.params.user
  }, function(err, account) {
    if (err) return res.redirect('/');
    if (!account) return res.redirect('/');
    Document.findOne({ 'slug': req.params.slug }, function (err, document) {
        if (err) return res.redirect('/' + account.username);
        if (!document) return res.redirect('/' + account.username);
        if (req.user) {
          if (req.user.username === req.params.user) {
            Document.find({ '_user' : document._user }, null, { sort: '-date.edited', limit: 8 }, function(err, documents) {
              if (err) return res.redirect('/');
              res.render('d/edit', {
                title: document.slug,
                user: req.user,
                document: document,
                documents: documents,
                editor: true
              });
            });
          } else {
            res.render('d/view', {
              title: document.content.title,
              document: document,
              account: account,
              user: req.user,
              view: true
            });
          }
        } else {
          res.render('d/view', {
            title: document.content.title,
            document: document,
            account: account,
            user: req.user,
            view: true
          });
        }
    });
  });
});

// preview
index.get('/:user/:slug/preview', function (req, res, next) {
  Account.findOne({
    username: req.params.user
  }, function(err, account) {
    if (err) res.redirect('/');
    Document.findOne({ 'slug': req.params.slug }, function (err, document) {
      if (err) return res.redirect('/');
      if (!document) return res.redirect('/');
      res.render('d/view', {
        title: document.content.title,
        document: document,
        account: account,
        user: req.user,
        view: true
      });
    });
  });
});

// raw html
index.get('/:user/:slug/raw/html', function (req, res, next) {
  Account.findOne({
    username: req.params.user
  }, function(err, account) {
    if (err) return res.redirect('/');
    Document.findOne({ 'slug': req.params.slug }, function (err, document) {
      if (err) return res.redirect('/');
      if (!document) return res.redirect('/');
      res.set('Content-Type', 'text/plain');
      res.send(document.content.data.html);
    });
  });
});

// raw md
index.get('/:user/:slug/raw/md', function (req, res, next) {
  Account.findOne({
    username: req.params.user
  }, function(err, account) {
    if (err) return res.redirect('/');
    Document.findOne({ 'slug': req.params.slug }, function (err, document) {
      if (err) return res.redirect('/');
      if (!document) return res.redirect('/');
      res.set('Content-Type', 'text/plain');
      res.send(document.content.data.raw);
    });
  });
});

// unnamed view
index.get('/~:id', function(req, res, next) {
  Document.findOne({
    _id: req.params.id
  }, function(err, document) {
    if (err) return next(err);
    Account.findOne({
      username: document.author
    }, function(err, account) {
      if (err) return next(err);
      res.render('d/view', {
        title: document.title,
        document: document,
        account: account,
        user: req.user,
        view: true
      });
    });
  });
});



// Ensure Authentication
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

module.exports = index;
