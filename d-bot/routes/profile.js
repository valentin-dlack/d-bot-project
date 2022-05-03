const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "dbot"
});

router.get("/", isAuthenticated, function(req, res, next) {
    res.render("profile/index.twig" , {
        user: req.user,
    });
});


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

module.exports = router;