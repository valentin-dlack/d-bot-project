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
router.get('/', function(req, res, next) {
    res.render('index', { 
      user: req.user,
    });
});

module.exports = router;
