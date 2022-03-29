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
    let password = req.body.password;
});

module.exports = router;