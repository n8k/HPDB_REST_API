var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// CORS
const cors = require('./routes/cors');

// Mongoose ___________________________________________________________________
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// Models _____________________________________________________________________
const Episode = require('./models/episodeModel')

// Routers ____________________________________________________________________
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var episodeRouter = require('./routes/episodeRouter');

// Mongo URL settings and connect _____________________________________________
const url = 'mongodb://localhost:27017/hpdb';
const connect = mongoose.connect(url, {});
connect.then(
	(db)  => { console.log("Connected to mongoDB at: " + url); },
	(err) => { console.log(err); });

// Express ____________________________________________________________________
var app = express();

// view engine setup __________________________________________________________
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes _________________________________________________________________
app.use('/', cors.corsWithOptions, episodeRouter);
app.use('/users', cors.corsWithOptions, usersRouter);
app.use('/episode', cors.corsWithOptions, episodeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
