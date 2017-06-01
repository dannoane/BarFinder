var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var User = require('./../lib/model/User').User;

var Notification = require('./../lib/model/Notification');

const mongoose = require('./../lib/model/Notification').mongoose;

var Preferences = require('./../lib/model/Preferences').Preferences;
var FindLocations = require('./../lib/util/FindLocations');
var _ = require('lodash');


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

/* GET - return locations based on user preferences */
router.get('/search/locations', (req, res) => {

  let userid = req.user.id;

  Preferences.findOne({ '_user' : userid })
    .populate('attires')
    .populate('categories')
    .populate('foodStyles')
    .populate('paymentOptions')
    .populate('restaurantServices')
    .populate('restaurantSpecialties')
    .exec(function (err, preferences) {
      if (err) {
        res.send({ 'error' : err.message });
      }

      let pref = {
        'attires' : _.map(preferences.attires, a => a.name),
        'categories' : _.map(preferences.categories, c => c.name),
        'foodStyles' : _.map(preferences.foodStyles, fs => fs.name),
        'paymentOptions' : _.map(preferences.paymentOptions, po => po.name),
        'restaurantServices' : _.map(preferences.restaurantServices, rs => rs.name),
        'restaurantSpecialties' : _.map(preferences.restaurantSpecialties, rs => rs.name),
        'priceRange': preferences.priceRange,
        'latitude': preferences.latitude,
        'longitude': preferences.longitude,
        'radius': preferences.radius,
      };

      FindLocations.findLocations(prefs, res);
    });
});

/* POST - return locations based on search criteria */
router.post('/search/locations', (req, res) => {

  let preferences = req.body;

  FindLocations.findLocations(preferences, res);
});


module.exports = router;
