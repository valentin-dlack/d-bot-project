var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const session = require('express-session');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var logoutRouter = require('./routes/logout');
var adminRouter = require('./routes/dashboard');
var profileRouter = require('./routes/profile');
var editProfileRouter = require('./routes/editProfile');
var createBlockRouter = require('./routes/createBlock');
var allBlocksRouter = require('./routes/allBlocks');
var blockRouter = require('./routes/block');
var editBlockRouter = require('./routes/editBlock');
var usersRouter = require('./routes/users');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

var app = express();

app.use(connectLiveReload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(session({
  secret: 'secr3t',
  resave: true,
  saveUninitialized: true,
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/dashboard', adminRouter);
app.use('/profile', profileRouter);
app.use('/editProfile', editProfileRouter);
app.use('/createBlock', createBlockRouter);
app.use('/allBlocks', allBlocksRouter);
app.use('/block', blockRouter);
app.use('/editBlock', editBlockRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;