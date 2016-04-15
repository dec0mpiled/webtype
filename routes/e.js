module.exports = function(io) {
  
  var express = require('express');
  var router = express.Router();
  
  // models
  var Document = require('../models/document');
  
  // local dependencies
  var slug = require('slug');
  var linkify = require('linkify-it')();
  var emoji = require('markdown-it-emoji');

  var md = require('markdown-it')({
    linkify: true, 
    typographer: true
  });
  
  md.use(emoji);
  
  //----------------------------------------------------------------------------//
  // DOCUMENT                                                                   //
  //----------------------------------------------------------------------------//
  
  // edit doc
  router.get('/d/:id', ensureAuthentication, function (req, res, next) {
    Document.findOne({ _id: req.params.id }, function (err, document) {
      if (err) return next(err);
      Document.find({ '_user' : document._user }, function(err, documents) {
        if (err) return next(err);
        res.render('d/edit', {
          title: 'Editor',
          user: req.user,
          document: document,
          documents: documents,
          editor: true
        });
      });
    });
  });
  
  // io sockets
  io.sockets.on('connection', function (socket) {
    socket.on('save', function (name, fn) {
      Document.findOneAndUpdate({ _id: name.id }, {
        slug: slug(name.title, { lower: true, remove: /[.]/g }),
        content: {
          title: name.title,
          data: {
            raw: name.content,
            html: md.render(name.content)
          }
        },
        date: {
          edited: new Date
        }
      }, function (err, document) {
        fn({ 'slug': slug(name.title, { lower: true, remove: /[.]/g }) });
      });
    });
  });
  
  /*
  
  */
  
  // document settings
  router.get('/d/:id/s', function(req, res, next) {
    Document.findOne({ _id: req.params.id }, function(err, document) {
      if (err) return next(err);
      if (req.query.publish == 'true') {
        document.draft = false;
      } else {
        document.draft = true;
      }
  
      document.save(function(err) {
        if (err) return next(err);
        res.redirect('/e/d/' + req.params.id);
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
  
  return router;
}