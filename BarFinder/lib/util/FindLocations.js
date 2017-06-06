var Location = require('./../model/Location').Location;
var _ = require('lodash');


function findLocations(preferences, res) {

  let locations = [];

  let name;
  if (preferences.name != null)
    name = preferences.name;
  else
    name = '';

  let re = new RegExp(`.*${name}.*`, 'i');

  let cursor = Location.find()
    .populate('_attire')
    .populate('_category')
    .populate('foodStyles')
    .populate('paymentOptions')
    .populate('restaurantServices')
    .populate('restaurantSpecialties')
    .cursor();

  cursor.on('data', function (location) {

    let getDistance = (lat1, lon1, lat2, lon2) => {

      var R = 6371; // km
      var dLat = (lat2-lat1)*Math.PI/180;
      var dLon = (lon2-lon1)*Math.PI/180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.asin(Math.sqrt(a));
      var d = R * c;
      console.log(d);
      return d;
    };

    if (!re.test(location.name))
      return;

    if (preferences.latitude != null && preferences.longitude != null && preferences.radius != null)
      if (getDistance(preferences.latitude, preferences.longitude, location.latitude, location.longitude) > (preferences.radius / 1000))
        return;

    let score = 0;

    if (name != '')
      score += 10;

    if (preferences.attires != null && location._attire != null && preferences.attires.includes(location._attire.name))
      score += 10;

    if (preferences.category != null && preferences.category == location._category)
      score += 10;

    if (preferences.foodStyles != null) {
      let matchingFs = _.intersection(preferences.foodStyles, _.map(location.foodStyles, fs => fs.name))
      _.forEach(matchingFs, (fs) => {
        score += 10;
      });
    }

    if (preferences.paymentOptions != null) {
      let matchingPo = _.intersection(preferences.paymentOptions, _.map(location.paymentOptions, po => po.name))
      _.forEach(matchingPo, (po) => {
        score += 10;
      });
    }

    if (preferences.restaurantServices != null) {
      let matchingRs = _.intersection(preferences.restaurantServices, _.map(location.restaurantServices, rs => rs.name))
      _.forEach(matchingRs, (rs) => {
        score += 10;
      });
    }

    if (preferences.restaurantSpecialties != null) {
      let matchingRs = _.intersection(preferences.restaurantSpecialties, _.map(location.restaurantSpecialties, rs => rs.name))
      _.forEach(matchingRs, (rs) => {
        score += 10;
      });
    }

    if (preferences.priceRange != null && preferences.priceRange == location.priceRange)
      score += 10;

    if (score > 0) {
      let index = _.sortedIndexBy(locations, score, l => -l.score);
      locations.splice(index, 0, {
        'location' : location,
        'score' : score,
      });
    }
  });

  cursor.on('close', function () {

    var data = {
      'locations' : _.map(locations, l => l.location),
    };

    res.send(JSON.stringify(data));
  });
}

module.exports.findLocations = findLocations;
