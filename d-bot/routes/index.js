const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const router = express.Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbot'
});

/* GET home page. */
router.get('/',isAuthenticated , function(req, res, next) {
    res.render('index', { 
      user: req.user,
      isAdmin: req.user.roles.indexOf('admin') > -1
    });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.roles.indexOf('admin') > -1) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
