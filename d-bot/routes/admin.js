var express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const fs = require('fs');
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

router.get('/delete/user/:id', isAuthenticated, isAdmin, function (req, res, next) {
    let id = req.params.id;
    connection.query('DELETE FROM users WHERE id = ?', [req.params.id], function (err, rows, fields) {
        if (err) throw err;
        res.redirect('/admin');
    });
});

router.get('/delete/post/:id', isAuthenticated, isAdmin, function (req, res, next) {
    let id = req.params.id;
    connection.query('SELECT * FROM blocs WHERE id = ?', [id], function (err, rows, fields) {
        fs.unlinkSync("./public"+rows[0].file);
        connection.query('DELETE FROM blocs WHERE id = ?', [req.params.id], function (err, rows, fields) {
            if (err) throw err;
            res.redirect('/admin');
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