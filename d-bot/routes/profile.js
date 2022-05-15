const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dbot"
});

let csrf_token = "";

router.get("/", isAuthenticated, function (req, res, next) {
  connection.query("SELECT * FROM blocs", function (err, rows, fields) {
    if (err) throw err;
    res.render("profile/index", {
      blocs: rows,
      user: req.user,
      isAdmin: req.user.roles.indexOf('admin') > -1
    });
  });
});

//delete profile
router.get("/delete", isAuthenticated, function (req, res, next) {
  let id = req.user.id;
  connection.query("SELECT * FROM users WHERE id = ?", [id], function (err, rows, fields) {
    if (err) throw err;
    //check if the user is the owner of the profile
    if (req.user.id == rows[0].id) {
      connection.query("DELETE FROM users WHERE id = ?", [id], function (err, rows, fields) {
        if (err) throw err;
        req.logout();
        res.redirect("/");
      });
    } else {
      res.redirect("/profile");
    }
  });
});

//edit profile
router.get("/edit", isAuthenticated, function (req, res, next) {
  csrf_token = ((Math.random() + 1).toString(34).substring(2) + (Math.random() + 1).toString(34).substring(2));
  let id = req.user.id;
  connection.query("SELECT * FROM users WHERE id = ?", [id], function (err, rows, fields) {
    if (err) throw err;
    //check if the user is the owner of the profile
    if (req.user.id == rows[0].id) {
      res.render("profile/edit", {
        user: rows[0],
        csrf_token: csrf_token,
        isAdmin: req.user.roles.indexOf('admin') > -1
      });
    }
  });
});

router.post("/edit", isAuthenticated, function (req, res, next) {
  let id = req.user.id;
  let name = req.body.name;
  let email = req.body.email;
  let created_at = new Date();

  if (req.body._token === csrf_token) {
    //check if the user is the owner of the profile
    connection.query("SELECT * FROM users WHERE id = ?", [id], function (err, rows, fields) {
      if (err) throw err;
      if (req.user.id == rows[0].id) {
        connection.query("UPDATE users SET username = ?, email = ?, created_at = ? WHERE id = ?", [name, email, created_at, id], function (err, rows, fields) {
          if (err) throw err;
          res.redirect("/profile");
        });
      } else {
        res.redirect("/profile");
      }
    });
  } else {
    res.redirect("/profile");
  }
});

//edit password
router.get("/password", isAuthenticated, function (req, res, next) {
  csrf_token = ((Math.random() + 1).toString(34).substring(2) + (Math.random() + 1).toString(34).substring(2));
  let id = req.user.id;
  connection.query("SELECT * FROM users WHERE id = ?", [id], function (err, rows, fields) {
    if (err) throw err;
    //check if the user is the owner of the profile
    if (req.user.id == rows[0].id) {
      res.render("profile/password", {
        user: rows[0],
        csrf_token: csrf_token,
        isAdmin: req.user.roles.indexOf('admin') > -1
      });
    }
  });
});

router.post("/password", isAuthenticated, function (req, res, next) {
  let id = req.user.id;
  let old_password = req.body.old_password;
  let password = req.body.password;
  let password_confirm = req.body.password_confirm;

  if (req.body._token === csrf_token) {
    //check if the user is the owner of the profile
    connection.query("SELECT * FROM users WHERE id = ?", [id], function (err, rows, fields) {
      if (err) throw err;
      if (req.user.id == rows[0].id) {
        if (password == password_confirm) {
          if (bcrypt.compareSync(old_password, rows[0].password)) {
            connection.query("UPDATE users SET password = ? WHERE id = ?", [password, id], function (err, rows, fields) {
              if (err) throw err;
              res.redirect("/profile");
            });
          } else {
            res.render("profile/password.twig", {
              error_m: "Wrong password"
              });
          }
        } else {
          res.render("profile/password.twig", {
            error_m : "Passwords don't match"
          });
        }
      } else {
        res.redirect("/profile");
      }
    });
  } else {
    res.redirect("/profile");
  }
});

router.get("/:id", isAuthenticated, function (req, res, next) {
  let id = req.params.id;
  if (id == req.user.id) {
    res.redirect("/profile");
    return
  }
  connection.query("SELECT * FROM blocs WHERE userId = ?", [id], function (err, rows, fields) {
    if (err) throw err;
    connection.query("SELECT * FROM users WHERE id = ?", [id], function (err, users, fields) {
      if (err) throw err;
      res.render("profile/show", {
        blocs: rows,
        user: req.user,
        profile: users[0],
        isAdmin: req.user.roles.indexOf('admin') > -1
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

module.exports = router;