/*-------------------------------------------------------*/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var flash = require('connect-flash');
//var Peer = require('peerjs');
//var port = process.env.PORT||3000;
/*-------------------------------------------------------*/
//connect db
var url = 'mongodb://localhost:27017/test';
//var url ='mongodb://manhtantna:VCYDBLKT0000@ds115653.mlab.com:15653/chat';
var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	mongoose.connect(url,{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
/*-------------------------------------------------------*/
//use router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
/*-------------------------------------------------------*/
/*-------------------------------------------------------*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*-------------------------------------------------------*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*-------------------------------------------------------*/
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//require('./passport')(passport);
/*-------------------------------------------------------*/
// use router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter);
/*-------------------------------------------------------*/

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
  res.render('page/error');
});
/*-------------------------------------------------------*/
module.exports = app;
