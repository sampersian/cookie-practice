var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/session-cookie', function(req, res, next) {
  if (typeof req.cookies.visitedSession === "undefined") {
    res.cookie('visitedSession', '1');
  } else {
    res.cookie('visitedSession', parseInt(req.cookies.visitedSession) + 1)
  }
  let visitedSession = parseInt(req.cookies.visitedSession) + 1;
  console.log("User has visited "+visitedSession+" times during this browser session.")
  res.render('index', { title: 'Express' });
})

app.get('/persistent-cookie', function(req, res, next) {
  if (typeof req.cookies.visitedEver === "undefined") {
    res.cookie('visitedEver', '1', {
      maxAge: 900000,
      httpOnly: true
    });
  } else {
    res.cookie('visitedEver', parseInt(req.cookies.visitedEver) + 1)
  }
  let visitedEver = parseInt(req.cookies.visitedEver) + 1;
  console.log("User has visited "+visitedEver+" times ever.")
  res.render('index', { title: 'Express' });
})

app.get('/clear-all', function(req, res, next) {
  res.clearCookie('visitedEver');
  res.clearCookie('visitedSession');
  console.log('Cookies have been cleared.');
  res.render('index', { title: 'Express' });
})

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
