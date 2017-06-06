const request = require('request');
const async = require('async');
const Location = require('./../model/Location').Location;
const Attire = require('./../model/Attire').Attire;
const Category = require('./../model/Category').Category;
const FoodStyle = require('./../model/FoodStyle').FoodStyle;
const PaymentOption = require('./../model/PaymentOption').PaymentOption;
const RestaurantService = require('./../model/RestaurantService').RestaurantService;
const RestaurantSpecialty = require('./../model/RestaurantSpecialty').RestaurantSpecialty;
const each = require('async-each-series');

module.exports.FacebookLocationDetails = class FacebookLocationDetails {

  constructor(city, accessToken) {

    this.city = city;
    this.accessToken = accessToken;
  }

  import() {

    let self = this;

    Location
      .find({})
      .populate({
        path: '_city',
        match: { name: this.city.name },
        select: 'name',
      })
      .exec((err, locations) => {

        if (err) {
          console.error(err.message);
          return;
        }

        each(
          locations,
          (location, next) => {
            self.importFromLocation(location, next);
          },
          () => {
            process.exit(0);
          }
        );
      });
  }

  importFromLocation(location, next) {

    let self = this;

    let url = 'https://graph.facebook.com/v2.9/' + location.facebookID;
    let parameters = this.getRequestParameters();

    url += `?${parameters}`;

    request(url, (err, response, data) => {

      if (err) {
        console.error(err.message);
        next();
        return;
      }

      if (response.statusCode != 200) {
        console.error(response.statusCode);
        console.error(data);
        next();
        return;
      }

      let body = JSON.parse(data);
      async.waterfall([
        (callback) => {

          if (!body.attire) {
            callback(null);
            return;
          }

          Attire.findOne({ 'name' : body.attire }, (err, attire) => {

            if (err) {
              callback(err);
              return;
            }
            if (attire) {
              location._attire = attire._id;
              callback(null);
              return;
            }

            let newAttire = Attire({ 'name' : body.attire });
            newAttire.save((err, attire) => {

              if (err) {
                callback(err);
                return
              }

              location._attire = attire._id;
              callback(null);
            });
          });
        },
        (callback) => {

          if (!body.category) {
            callback(null);
            return;
          }

          Category.findOne({ 'name' : body.category }, (err, category) => {

            if (err) {
              callback(err);
              return;
            }
            if (category) {
              location._category = category._id;
              callback(null);
              return;
            }

            let newCategory = Category({ 'name' : body.category });
            newCategory.save((err, category) => {

              if (err) {
                callback(err);
                return;
              }

              location._category = category._id;
              callback(null);
            });
          });
        },
        (callback) => {

          if (!body.food_styles) {
            callback(null);
            return;
          }

          location.foodStyles = [];
          each(
            body.food_styles,
            (food_style, cb) => {
              FoodStyle.findOne({ 'name' : food_style }, (err, foodStyle) => {

                if (err) {
                  cb(err);
                  return;
                }
                if (foodStyle) {
                  location.foodStyles.push(foodStyle._id);
                  cb();
                  return;
                }

                let newFoodStyle = FoodStyle({ 'name' : food_style });
                newFoodStyle.save((err, foodStyle) => {

                  if (err) {
                    cb(err);
                    return;
                  }

                  location.foodStyles.push(foodStyle._id);
                  cb();
                });
              });
            },
            (err) => {

              callback(err);
            }
          );
        },
        (callback) => {

          if (!body.payment_options) {
            callback(null);
            return;
          }

          let keys = [];
          for (let k in body.payment_options)
            keys.push(k);

          location.paymentOptions = [];
          each(
            keys,
            (payment_option, cb) => {

              if (body.payment_options[payment_option] === 0) {
                cb();
                return;
              }

              PaymentOption.findOne({ 'name' : payment_option }, (err, paymentOption) => {

                if (err) {
                  cb(err);
                  return;
                }
                if (paymentOption) {
                  location.paymentOptions.push(paymentOption._id);
                  cb();
                  return;
                }

                let newPaymentOption = PaymentOption({ 'name' : payment_option });
                newPaymentOption.save((err, paymentOption) => {

                  if (err) {
                    cb(err);
                    return;
                  }

                  location.paymentOptions.push(paymentOption._id);
                  cb();
                });
              });
            },
            (err) => {

              callback(err);
            }
          );
        },
        (callback) => {

          if (!body.restaurant_services) {
            callback(null);
            return;
          }

          let keys = [];
          for (let k in body.restaurant_services)
            keys.push(k);

          location.restaurantServices = [];
          each(
            keys,
            (restaurant_service, cb) => {

              if (body.restaurant_services[restaurant_service] === false) {
                cb();
                return;
              }

              RestaurantService.findOne({ 'name' : restaurant_service }, (err, restaurantService) => {

                if (err) {
                  cb(err);
                  return;
                }
                if (restaurantService) {
                  location.restaurantServices.push(restaurantService._id);
                  cb();
                  return;
                }

                let newRestaurantService = RestaurantService({ 'name' : restaurant_service });
                newRestaurantService.save((err, restaurantService) => {

                  if (err) {
                    cb(err);
                    return;
                  }

                  location.restaurantServices.push(restaurantService._id);
                  cb();
                });
              });
            },
            (err) => {

              callback(err);
            }
          );
        },
        (callback) => {

          if (!body.restaurant_specialties) {
            callback(null);
            return;
          }

          let keys = [];
          for (let k in body.restaurant_specialties)
            keys.push(k);

          location.restaurantSpecialties = [];
          each(
            keys,
            (restaurant_specialty, cb) => {

              if (body.restaurant_specialties[restaurant_specialty] === 0) {
                cb();
                return;
              }

              RestaurantSpecialty.findOne({ 'name' : restaurant_specialty }, (err, restaurantSpecialty) => {

                if (err) {
                  cb(err);
                  return;
                }
                if (restaurantSpecialty) {
                  location.restaurantSpecialties.push(restaurantSpecialty._id);
                  cb();
                  return;
                }

                let newRestaurantSpecialty = RestaurantSpecialty({ 'name' : restaurant_specialty });
                newRestaurantSpecialty.save((err, restaurantSpecialty) => {

                  if (err) {
                    cb(err);
                    return;
                  }

                  location.restaurantSpecialties.push(restaurantSpecialty._id);
                  cb();
                });
              });
            },
            (err) => {

              callback(err);
            }
          );
        },
        (callback) => {

          location.about = body.about;
          location.latitude = body.location.latitude;
          location.longitude = body.location.longitude;
          location.street = body.location.street;
          location.checkins = body.checkins;
          location.cover = (body.cover != null) ? body.cover.source : undefined;
          location.description = body.description;
          location.hours = body.hours;
          location.impressum = body.impressum;
          location.rating = body.overall_star_rating;
          location.parking = body.parking;
          location.phone = body.phone;
          location.priceRange = body.price_range;
          location.ratingCount = body.rating_count;
          location.publicTransit = body.public_transit;

          location.save((err, updatedLocation) => {
              callback(err);
          });
        }
      ],
      (err, _) => {
        next(err);
      });
    });
  }

  getRequestParameters() {

    let parameters = [
      'about',
      'location',
      'attire',
      'category',
      'checkins',
      'cover',
      'description',
      'food_styles',
      'hours',
      'impressum',
      'overall_star_rating',
      'parking',
      'payment_options',
      'phone',
      'price_range',
      'rating_count',
      'restaurant_services',
      'restaurant_specialties',
      'public_transit',
    ];

    let requestParameters = `access_token=${this.accessToken}&fields=${parameters.join(',')}`;

    return requestParameters;
  }
}
