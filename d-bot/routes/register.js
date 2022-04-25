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
    res.render('users/register');
});

router.post('/', function(req, res, next) {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password_confirm = req.body.confirm_password;
    //register
    if (password === password_confirm) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows, fields) {
            if (error) throw error;
            if (rows.length > 0) {
                res.render('users/register', { e_message: 'Email already exists!' });
            } else {
                connection.query('SELECT * FROM users WHERE username = ?', [username], function(err, rows, fields) {
                    if (error) throw error;
                    if (rows.length > 0) {
                        res.render('users/register', { e_message: 'Username already exists!' });
                    } else {
                        let salt = bcrypt.genSaltSync(10);
                        let hash = bcrypt.hashSync(password, salt);
                        connection.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hash], function(err, rows, fields) {
                            if (error) throw error;
                            res.redirect('/login');
                        });
                    }
                });
            }
        });
    }

});

module.exports = router;