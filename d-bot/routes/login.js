const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const router = express.Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbot'
});

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('users/login');
});

router.post('/', function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows, fields) {
        if (error) throw error;
        if (rows.length > 0) {
            if (bcrypt.compareSync(password, rows[0].password)) {
                session.user = rows[0];
                session.loggedIn = true;
                res.redirect('/');
            } else {
                res.render('users/login', { e_message: 'Incorrect username and/or password!' });
            }
        } else {
            res.render('users/login', { e_message: 'Incorrect username and/or password!' });
        }
        res.end();
    });
});

module.exports = router;