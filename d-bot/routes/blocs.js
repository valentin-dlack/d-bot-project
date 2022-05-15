var express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const bcrypt = require('bcrypt');
var router = express.Router();
const fs = require('fs');

let csrf_token = '';

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
            blocs: rows,
            user: req.user,
            isAdmin: req.user.roles.indexOf('admin') > -1
        });
    });
});

//new bloc
router.get('/new', isAuthenticated, (req, res) => {
    res.render('blocs/new.twig', {
        user: req.user, 
        isAdmin: req.user.roles.indexOf('admin') > -1
    });
});

router.post('/new', isAuthenticated, (req, res) => {
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
    let file_path = f_gen.generate(bot_name, commands, desc, category, option_type, option_name, isRequired, action);
    console.log(userId, name, description, command, created_at, file_path);
    connection.query('INSERT INTO blocs (userId, title, content, blocContent, created_at, file) VALUES (?, ?, ?, ?, ?, ?)', [userId, name, description, command, created_at, file_path], function (err, rows, fields) {
        if (err) throw err;
        res.redirect('/blocs');
    });
});

router.get('/:id', isAuthenticated, (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM blocs WHERE id = ?', [id], function (err, rows, fields) {
        if (err) throw err;
        //get user that created the bloc
        connection.query('SELECT * FROM users WHERE id = ?', [rows[0].userId], function (err, user, fields) {
            if (err) throw err;
            res.render('blocs/show', {
                bloc: rows[0],
                user: user[0],
                viewer: req.user,
                isAdmin: req.user.roles.indexOf('admin') > -1
            });
        });
    });
});

router.get('/edit/:id', isAuthenticated, (req, res) => {
    let id = req.params.id;
    csrf_token = ((Math.random() + 1).toString(34).substring(2) + (Math.random() + 1).toString(34).substring(2));
    console.log(csrf_token);
    connection.query('SELECT * FROM blocs WHERE id = ?', [id], function (err, rows, fields) {
        if (err) throw err;
        //get user that created the bloc
        connection.query('SELECT * FROM users WHERE id = ?', [rows[0].userId], function (err, user, fields) {
            if (err) throw err;
            if (user[0].id === req.user.id) {
                res.render('blocs/edit', {
                    bloc: rows[0],
                    user: user[0],
                    csrf_token: csrf_token,
                    isAdmin: req.user.roles.indexOf('admin') > -1
                });
            } else {
                res.redirect('/blocs');
            }
        });
    });
});

router.post('/edit/:id', isAuthenticated, (req, res) => {
    let id = req.params.id;
    let name = req.body.title;
    let description = req.body.content;

    if (req.body._token === csrf_token) {
        connection.query('UPDATE blocs SET title = ?, content = ? WHERE id = ?', [name, description, id], function (err, rows, fields) {
            if (err) throw err;
            res.redirect('/blocs/' + id);
        });
    } else {
        res.redirect('/');
    }
});

router.get('/delete/:id', isAuthenticated, (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM blocs WHERE id = ?', [id], function (err, rows, fields) {
        if (err) throw err;
        //get user that created the bloc
        connection.query('SELECT * FROM users WHERE id = ?', [rows[0].userId], function (err, user, fields) {
            if (err) throw err;
            if (user[0].id === req.user.id) {
                fs.unlinkSync(rows[0].file);
                connection.query('DELETE FROM blocs WHERE id = ?', [id], function (err, rows, fields) {
                    if (err) throw err;
                    res.redirect('/blocs');
                });
            } else {
                res.redirect('/blocs');
            }
        });
    });
});

//download bloc file
// router.get('/download/:id', isAuthenticated, (req, res) => {
//     let id = req.params.id;
//     connection.query('SELECT * FROM blocs WHERE id = ?', [id], function (err, rows, fields) {
//         if (err) throw err;

//         res.download(rows[0].file);
//     });
// });

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;