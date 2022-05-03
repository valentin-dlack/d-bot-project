var express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const bcrypt = require('bcrypt');
var router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'dbot'
});

router.get('/login', (req, res) => {
  console.log(req.flash('loginMessage'));
  res.render('users/login', {
    message: req.flash('loginMessage')
  });
})

router.get('/register', (req, res) => {
  res.render('users/register');
})

//Register handle
router.post('/register', (req, res) => {
  let email = req.body.mail;
  let username = req.body.username;
  let password = req.body.password;
  let password_confirm = req.body.confirm_password;
  let roles = JSON.stringify(['user'])
  let badges = JSON.stringify(['newbie']);
  let created_at = new Date();
  //register
  if (password === password_confirm) {
    connection.query('SELECT * FROM users WHERE email = ?', [email], function (err, rows, fields) {
      if (err) throw err;
      if (rows.length > 0) {
        res.render('users/register', {
          e_message: 'Email already exists!'
        });
      } else {
        connection.query('SELECT * FROM users WHERE username = ?', [username], function (err, rows, fields) {
          if (err) throw err;
          if (rows.length > 0) {
            res.render('users/register', {
              e_message: 'Username already exists!'
            });
          } else {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
            connection.query('INSERT INTO users (email, username, password, roles, badges, created_at) VALUES (?, ?, ?, ?, ?, ?)', [email, username, hash, roles, badges, created_at], function (err, rows, fields) {
              if (err) throw err;
              res.redirect('/login');
            });
          }
        });
      }
    });
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
    
});

//logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

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

/*

*/