const express = require('express');
const router = express.Router();

/* Get register page. */
router.get('/', function(req, res, next) {
    res.render('users/register');
});

module.exports = router;