var express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
var router = express.Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbot'
});

router.get('/', isAuthenticated, isAdmin, function (req, res, next) {
    connection.query('SELECT * FROM blocs', function (err, rows, fields) {
        connection.query('SELECT * FROM users', function (err, users, fields) {
            if (err) throw err;
            res.render('admin/index', {
                blocs: rows,
                users: users,
                user: req.user,
            });
        });
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