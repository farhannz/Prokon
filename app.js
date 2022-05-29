var createError = require('http-errors');
const https = require('https');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var studentRouter = require('./routes/student');
var adminRouter = require('./routes/admin');
var dashboardRouter = require('./routes/dashboard');
var api = require("./routes/api");
const session = require('express-session');
const { default: jsQR } = require('jsqr');

var app = express();

// function requireHTTPS(req, res, next) {
//   // The 'x-forwarded-proto' check is for Heroku
//   if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
//     return res.redirect('https://' + req.get('host').replace(':3000','') + req.url);
//   }
//   next();
// }

// app.use(requireHTTPS)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : "Ini adalah kunci rahasia dari session!", httpOnly: true, secure: true}))


app.use('/', indexRouter);
app.use('/students', studentRouter);
app.use('/admin', adminRouter);
app.use('/api', api, (req, res) => {
  if(!Object.keys(req.body).length) res.sendStatus(400);
})
app.use('/dashboard',dashboardRouter);


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
