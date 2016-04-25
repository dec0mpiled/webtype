require('newrelic');

// dependencies
var express        = require('express');
var socket_io      = require('socket.io');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var moment         = require('moment');
var HandlebarsIntl = require('handlebars-intl');
var LocalStrategy  = require('passport-local').Strategy;
var session        = require('express-session');
var MongoDBStore   = require('connect-mongodb-session')(session);

var app            = express();

// socket.io
var io             = socket_io();
app.io             = io;

var routes         = require('./routes/index');
var auth           = require('./routes/auth');
var edit           = require('./routes/edit')(io);
var d              = require('./routes/d');

// dotenv (environment variables) (include .env)
if (app.get('env') === 'development') {
  require('dotenv').load();
}

var hbs = require('hbs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


hbs.registerHelper('equal', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// https://gist.github.com/TastyToast/5053642
hbs.registerHelper('truncate', function(str, len) {
  if (str.length > len && str.length > 0) {
    var new_str = str + " ";
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(" "));
    new_str = (new_str.length > 0) ? new_str : str.substr(0, len);

    return new Handlebars.SafeString(new_str + '...');
  }
  return str;
});

// fomatjs.io
HandlebarsIntl.registerWith(hbs);

app.set("jsonp callback", true);

var store = new MongoDBStore({ 
  uri: process.env.MONGOURI,
  collection: 'sessions'
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  store: store,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', auth);
app.use('/', routes);
app.use('/edit', edit);
app.use('/d', d);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect(process.env.MONGOURI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
