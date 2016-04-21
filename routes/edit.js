module.exports = function(io) {
  
  var express = require('express');
  var edit = express.Router();
  
  // models
  var Document = require('../models/document');
  
  // local dependencies
  var slug = require('slug');
  var linkify = require('linkify-it')();
  var math = require('markdown-it-mathjax')
  var emoji = require('markdown-it-emoji');
  var footnotes = require('markdown-it-footnote');
  var video = require('markdown-it-video');
  var arrows = require('markdown-it-smartarrows');
  var checkbox = require('markdown-it-task-lists');
  var anchor = require('markdown-it-headinganchor');

  var md = require('markdown-it')({
    linkify: true, 
    typographer: true
  });
  
  md.use(emoji);
  md.use(math);
  md.use(footnotes);
  md.use(video);
  md.use(arrows);
  md.use(checkbox);
  md.use(anchor);
  
  //----------------------------------------------------------------------------//
  // DOCUMENT                                                                   //
  //----------------------------------------------------------------------------//
  
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
    
    // to draft
    socket.on('draft', function(name, fn) {
      Document.findOneAndUpdate({ _id: name.id }, {
        draft: true,
        date: {
          edited: new Date
        }
      }, function (err, document) {
        fn({ 'draft' : true });
      });
    });
    
    // to publish
    socket.on('publish', function(name, fn) {
      Document.findOneAndUpdate({ _id: name.id }, {
        draft: false,
        date: {
          edited: new Date
        },
        content: {
          published: {
            title: name.title,
            raw: name.raw,
            html: md.render(name.raw)
          }
        }
      })
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
  
  return edit;
}