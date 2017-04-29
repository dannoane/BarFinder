var express = require('express');
var router = express.Router();

// ensure user is loged in
router.all('^(?!/login)', require('connect-ensure-login').ensureLoggedIn());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
