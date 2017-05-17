var express = require('express');
var router = express.Router();

var User = require('./../lib/model/User').User;

// ensure user is loged in
router.all('^(?!/login)', require('connect-ensure-login').ensureLoggedIn());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { user: req.user });
});

module.exports = router;
