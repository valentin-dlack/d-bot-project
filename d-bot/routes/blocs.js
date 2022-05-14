var express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const bcrypt = require('bcrypt');
var router = express.Router();

const f_gen = require('../utils/generator.js');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbot'
});

router.get('/', (req, res) => {
    connection.query('SELECT * FROM blocs', function (err, rows, fields) {
        if (err) throw err;
        res.render('blocs/index', {
            blocs: rows
        });
    });
});

//new bloc
router.get('/new', (req, res) => {
    res.render('blocs/new.twig');
});

router.post('/new', (req, res) => {
    console.log(req.body);
    let userId = req.user.id;
    let name = req.body.title;
    let bot_name = req.body.name;
    let description = req.body.content;
    let commands = req.body.command;
    let desc = req.body.description;
    let category = req.body.category;
    let option_type = req.body.option_type;
    let option_name = req.body.option_name;
    let isRequired = req.body.isRequired;
    let action = req.body.action;
    let command = JSON.stringify(commands);
    let created_at = new Date();
    f_gen.generate(bot_name, commands, desc, category, option_type, option_name, isRequired, action);
    console.log(userId, name, description, command, created_at);
    connection.query('INSERT INTO blocs (userId, title, content, blocContent, created_at) VALUES (?, ?, ?, ?, ?)', [userId, name, description, command, created_at], function (err, rows, fields) {
        if (err) throw err;
        res.redirect('/blocs');
    });
});

router.get('/:id', (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM blocs WHERE id = ?', [id], function (err, rows, fields) {
        if (err) throw err;
        //get user that created the bloc
        connection.query('SELECT * FROM users WHERE id = ?', [rows[0].userId], function (err, user, fields) {
            if (err) throw err;
            res.render('blocs/show', {
                bloc: rows[0],
                user: user[0],
                viewer: req.user
            });
        }
        );
    });
});

module.exports = router;