const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const passportConfig = require('./config/passport');
const flash = require('connect-flash');

var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

passportConfig(passport);

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'dbot'
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

console.log(path.join(__dirname, '/public'));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(connectLiveReload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'dbot',
  multipleStatements: true,
});
connection.connect((err) => {
  if (!err) {
    console.log('DB connection succeded.');
  } else {
    console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
  }
});


app.use(express.static(path.join(__dirname, '/public')));
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/profile', require('./routes/profile'));
app.use('/blocs', require('./routes/blocs'));

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