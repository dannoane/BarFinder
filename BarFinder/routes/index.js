var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var User = require('./../lib/model/User').User;
var Notification = require('./../lib/model/Notification');

const mongoose = require('./../lib/model/Notification').mongoose;

// ensure user is loged in
router.all('^(?!/login)', require('connect-ensure-login').ensureLoggedIn());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { user: req.user });
});

router.get('/notifications', function(req, res, next){
  User.findOne({username: req.user.username})
    .populate('notifications')
      .exec(function(err, user){
        res.render('notifications', {username: req.user.username, notifications: user.notifications});
      });
})

router.post('/notifications/delete', function(req, res, next){
  User.findOne({username: req.user.username}, function(err, user){
    var index = user.notifications.indexOf(req.body.notificationId);
    if (index > -1){
      user.notifications.splice(index, 1);
      user.save(function(err){
        if (err)
          res.send(err.message);
        else
          res.send("SUCCESS");
      });
    }
  });
})

module.exports = router;
