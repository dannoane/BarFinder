var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const async = require('async');
const each = require('async-each-series');

var User = require('./../lib/model/User').User;

var Notification = require('./../lib/model/Notification');

var Attire = require('./../lib/model/Attire').Attire;
var Category = require('./../lib/model/Category').Category;
var FoodStyle = require('./../lib/model/FoodStyle').FoodStyle;
var PaymentOption = require('./../lib/model/PaymentOption').PaymentOption;
var RestaurantService = require('./../lib/model/RestaurantService').RestaurantService;
var RestaurantSpecialty = require('./../lib/model/RestaurantSpecialty').RestaurantSpecialty;
var Review = require('./../lib/model/Review').Review;
//name Location OurLocation so it doesn`t conflict
var OurLocation = require('./../lib/model/Location').Location;
var Notification = require('./../lib/model/Notification').Notification;

var Group = require('./../lib/model/Group').Group;

const mongoose = require('./../lib/model/Notification').mongoose;

var Preferences = require('./../lib/model/Preferences').Preferences;
var FindLocations = require('./../lib/util/FindLocations');
var _ = require('lodash');


// ensure user is loged in
router.all('^(?!/login)', require('connect-ensure-login').ensureLoggedIn());

/* GET home page. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users){
    res.render('home', { user: req.user , users: users});
  })
  // res.render('home', { user: req.user });
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

router.get('/search', function(req, res, next){
  var locals = {};
  var tasks = [
    //populate attires
    function(callback){
      locals.attires = [];
      Attire.find({}, function(err, attires){
        if (err) return callback(err);
        attires.forEach(function(element) {
          locals.attires.push(element.name);
        }, this);
        callback();
      })
    },
    //populate foodStyles
    function(callback){
      locals.foodStyles = [];
      FoodStyle.find({}, function(err, foodStyles){
        if (err) return callback(err);
        if (foodStyles){
          foodStyles.forEach(function(element) {
            locals.foodStyles.push(element.name);
          }, this);
        }
        callback();
      })
    },
    //populate services
    function(callback){
      locals.restaurantServices = [];
      RestaurantService.find({}, function(err, restaurantServices){
        if (err) return callback(err);
        restaurantServices.forEach(function(element) {
          locals.restaurantServices.push(element.name);
        }, this);
        callback();
      })
    },
    function(callback){
      locals.categories = [];
      Category.find({}, function(err, categories){
        if (err) return callback(err);
        categories.forEach(function(element) {
          locals.categories.push(element.name);
        }, this);
        callback();
      })
    },
    function(callback){
      locals.paymentOptions = [];
      PaymentOption.find({}, function(err, paymentOptions){
        if (err) return callback(err);
        paymentOptions.forEach(function(element) {
          locals.paymentOptions.push(element.name);
        }, this);
        callback();
      })
    },
    function(callback){
      locals.restaurantSpecialties = [];
      RestaurantSpecialty.find({}, function(err, restaurantSpecialties){
        if (err) return callback(err);
        restaurantSpecialties.forEach(function(element) {
          locals.restaurantSpecialties.push(element.name);
        }, this);
        callback();
      })
    }
  ];
  async.parallel(tasks, function(err){
    if (err) res.send(err.message);
    res.render('search', {username: req.user.username, selectables: locals});
  })
})

//make plan (link location id with group(id))
router.post('/search/makePlan', function(req, res, next){
  Group.findOne({_id: req.body.groupId}, function(err, group){
    group._location = req.body.locationId;
    group.save(function (err, group){
      if (err)
          res.send(err.message);
        else{
          var newNotification = Notification({text: 'The plan for group '+group.name+' has changed. Click notification to go to page',
                  path: 'http://10.10.10.10:3000/group/'+group._id});
          newNotification.save(function(err, notification){
            User.findOne({_id: req.user._id}, function(err, user){
              user.notifications.push(notification._id);
              user.save(function(err){
                if(err)
                  res.send(err.message);
                else
                  res.send("SUCCESS");
              })
            })
          });
        }
    });
  });
})

//get groups where user is admin
router.post('/groups/administers', function(req, res, next){
  User.findOne({_id: req.user._id})
    .populate('admin')
      .exec(function(err, user){
        //TODO : check sending type
        res.send(user.admin);
      })
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
      if (preferences){
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

        FindLocations.findLocations(pref, res);
      }
      else{
        res.send("")
      }
    });
});

/* POST - return locations based on search criteria */
router.post('/search/locations', (req, res) => {

  let preferences = req.body;
  console.log(preferences);

  FindLocations.findLocations(preferences, res);
});

router.get('/groups', function(req, res, next){
  User.findOne({username: req.user.username})
    .populate('groups')
      .exec(function(err, user){
        // groups = [Group({name: "TEST"})];
        res.render('groups', {username: req.user.username, groups: user.groups});
      });
})

router.post('/groups', function(req, res, next){
  User.findOne({username: req.user.username}, function(err, user){
    if (err)
      res.send(err.message)
    else{
      var newGroup = Group({
        name: req.body.groupName,
        date: new Date(),
        _location: null,
        _admin: user._id,
        users: [user._id],
      });
      newGroup.save(function(err, group){
        if (err)
          res.send(err.message);
        else{
          user.groups.push(group._id);
          user.admin.push(group._id);
          user.save(function(err, user2){
            if (err)
              res.send(err.message);
            else{
              // res.send(200);
              // res.writeHead(200, {"Content-Type": "text/plain"});
              // res.end("Hello!!");
                res.writeHead(301,
                  {Location: 'http://10.10.10.10:3000/groups'}
                  );
                res.end();
            }
          });
        } 
      })
    }
  });
  
})

router.get('/preferences', function(req, res, next){
  var locals = {};
  var tasks = [
    //populate attires
    function(callback){
      locals.attires = [];
      Attire.find({}, function(err, attires){
        if (err) return callback(err);
        attires.forEach(function(element) {
          locals.attires.push(element);
        }, this);
        callback();
      })
    },
    //populate foodStyles
    function(callback){
      locals.foodStyles = [];
      FoodStyle.find({}, function(err, foodStyles){
        if (err) return callback(err);
        foodStyles.forEach(function(element) {
          locals.foodStyles.push(element);
        }, this);
        callback();
      })
    },
    //populate services
    function(callback){
      locals.restaurantServices = [];
      RestaurantService.find({}, function(err, restaurantServices){
        if (err) return callback(err);
        restaurantServices.forEach(function(element) {
          locals.restaurantServices.push(element);
        }, this);
        callback();
      })
    },
    function(callback){
      locals.categories = [];
      Category.find({}, function(err, categories){
        if (err) return callback(err);
        categories.forEach(function(element) {
          locals.categories.push(element);
        }, this);
        callback();
      })
    },
    function(callback){
      locals.paymentOptions = [];
      PaymentOption.find({}, function(err, paymentOptions){
        if (err) return callback(err);
        paymentOptions.forEach(function(element) {
          locals.paymentOptions.push(element);
        }, this);
        callback();
      })
    },
    function(callback){
      locals.restaurantSpecialties = [];
      RestaurantSpecialty.find({}, function(err, restaurantSpecialties){
        if (err) return callback(err);
        restaurantSpecialties.forEach(function(element) {
          locals.restaurantSpecialties.push(element);
        }, this);
        callback();
      })
    },
    function(callback){
        locals.preferences = {};
        Preferences.findOne({_user: req.user._id})
          .populate('attires')
          .populate('categories')
          .populate('foodStyles')
          .populate('paymentOptions')
          .populate('restaurantServices')
          .populate('restaurantSpecialties')
          .populate('priceRange')
          .exec(function(err, pref){
            if (pref)
              locals.preferences = pref;
            callback();
          })
    }
  ];
  async.parallel(tasks, function(err){
    if (err) res.send(err);
    else{
      //TODO:remove selected preference
      res.render('preferences', {username: req.user.username, selectables: locals});
    }
  })
})

router.post('/preferences', function(req, res, next){
  var preferences = req.body.preferences;
  Preferences.findOne({_user: req.user._id}, function(err, pref){
    if(err)
      res.send(err.message);
    else{
      if (pref){//user already has preferences
        pref.attires = preferences.attires;
        pref.categories= preferences.categories;
        pref.foodStyles= preferences.foodStyles;
        pref.paymentOptions= preferences.paymentOptions;
        pref.restaurantServices= preferences.restaurantServices;
        pref.restaurantSpecialties= preferences.restaurantSpecialties;
        pref.priceRange= preferences.priceRange;
        pref.latitude= null;
        pref.longitude= null;
        pref.radius= null;
        pref.save(function(err, pref2){
          if(err){
            res.send(err.message);
          }
          else{
            res.send("SUCCESS");
          }
        })

      } 
      else{//user has no preferences yet
        var newPreference = Preferences({
          _user: req.user._id,
          attires: preferences.attires,
          categories: preferences.categories,
          foodStyles: preferences.foodStyles,
          paymentOptions: preferences.paymentOptions,
          restaurantServices: preferences.restaurantServices,
          restaurantSpecialties: preferences.restaurantSpecialties,
          priceRange: preferences.priceRange,
          latitude: null,
          longitude: null,
          radius: null,
        })
        newPreference.save(function(err, pref2){
          if (err){
            res.send(err.message);
          }
          else{
            res.send("SUCCESS");
          }
        })
      } 
    }
  })
})

router.get('/reviews/:locationId', function(req, res, next){
  // OurLocation.findOne({_id: req.params["locationId"]})
  //   .populate('reviews')
  //     .exec(function(err, location){
  //       res.render('reviews',{username: req.user.username, location: location, reviews: location.reviews});
  //     });
  OurLocation.findOne({_id: req.params["locationId"]})
    .populate({
      path: 'reviews',
      populate: {path: '_user'}
    })
      .exec(function(err, location){
        res.render('reviews',{username: req.user.username, location: location, reviews: location.reviews});
      });
})

router.post('/reviews', function(req, res, next){
  var newReview = Review({
        _user: req.user._id, 
        _location: req.body.locationId, // TODO: check this!!!
        rating: req.body.rating,
        comment: req.body.comment
      });
  newReview.save(function(err, review){
    User.findOne({username: req.user.username}, function(err, user){
        user.reviews.push(review._id);
        user.save(function(err){
          if (err)
            res.send(err.message);
          else{
            OurLocation.findOne({_id: req.body.locationId}, function(err, location){
              location.reviews.push(review._id);
              location.save(function(err){
                if (err)
                  res.send(err.message);
                else
                  res.send("SUCCESS");
              });
            });
          }
        });
      });
  });
  
})

router.get('/group/:groupId', function(req, res, next){
  Group.findOne({_id: req.params['groupId']})
    .populate('users')
    .populate('_admin')
    .exec(function(err, group){
      // group._location = '59357530405bcc0f2d854eb4';
      if(group._location){
        OurLocation.findOne({_id: group._location})
          .populate('_attire')
          .populate('_category')
          .populate('foodStyles')
          .populate('paymentOptions')
          .populate('restaurantServices')
          .populate('restaurantSpecialties')
          .exec(function(err, location){
            if (err)
              res.send(err.message);
            else{
              res.render('group',{username: req.user.username, group: group, location: location});
            }
          })
      }
      else{
        res.render('group',{username: req.user.username, group: group, location: null});
      }
    })
})

router.post('/group/:groupId/findUsers',function(req, res, next){
  console.log(req.body.username + '.*');
  User.find({username: new RegExp(req.body.username + '.*')}, function(err, users){
    res.send(users);
  })
})

router.post('/group/:groupId/addUser',function(req, res, next){
  User.findOne({username: req.body.username}, function(err, user){
    if (err){
      res.send(err.message);
    }
    else{
      Group.findOne({_id: req.params['groupId']}, function(err, group){
        if (err){
          res.send(err.message);
        }
        else{
          if (_.includes(group.users, user._id)){
            res.send("User already in group")
          }
          else{
            group.users.push(user._id);
            group.save(function(err, group){
              if (err){
                res.send(err.message);
              }
              else{
                user.groups.push(group._id);
                var newNotification = Notification({text: 'You have been added to a group. Click notification to go to page',
                  path: 'http://10.10.10.10:3000/group/'+group._id});
                newNotification.save(function(err, notification){
                  user.notifications.push(notification._id);
                  user.save(function(err){
                    if (err){
                      res.send(err.message);
                    }
                    else{
                      res.send("SUCCESS");
                    }
                  })
                })                
              }
            })
          }
        }
      })
    }
  })
})

router.post('/group/:groupId/deleteUser', function(req, res, next){
  Group.findOne({_id: req.params['groupId']}, function(err, group){
    var index = group.users.indexOf(req.body.userId);
    if (index > -1){
      group.users.splice(index, 1);
      group.save(function(err){
        if (err)
          res.send(err.message);
        else{
          User.findOne({username: req.user.username}, function(err, user){
            var newNotification = Notification({text: 'You have been removed from the group' + group.name,
                  path: '#'});
            newNotification.save(function(err, notification){
              if (err){
                res.send(err.message);
              }
              user.notifications.push(notification._id);
              user.save(function(err, user){
                if (err)
                  res.send(err.message);
                else
                  res.send("SUCCESS");
              })
            })
          })
        }
      });
    }
  });
})

router.post('/group/:groupId/setDate', function(req, res, next){
  Group.findOne({_id: req.params['groupId']}, function(err, group){
    if (err){
      res.send(err.message);
    }
    else{
    group.date = req.body.date;
    group.save(function(err){
      if(err){
        res.send(err.message);
      }
      else{
        res.send("SUCCESS");
      }
    });
    }
  })
})

module.exports = router;
