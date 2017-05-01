const request = require('request');
const async = require('async');
const bl = require('bl');
const CoverBoundingBox = require('./../util/CoverBoundingBox').CoverBoundingBox;
const Location = require('./../model/Location').Location;
const mongoose = require('./../model/Location').mongoose;
const each = require('async-each-series');

module.exports.FacebookLocation = class FacebookLocation {

  constructor(city, accessToken) {

    this.city = city;
    this.accessToken = accessToken;
  }

  import() {

    let coverBoundingBox = new CoverBoundingBox(this.city, 2000);
    let circleCenters = coverBoundingBox.getAllCircleCenters();

    let self = this;

    each(
      circleCenters,
      (area, next) => {
        self.importFromArea(area, next);
      },
      () => {
        mongoose.disconnect();
      }
    );
  }

  importFromArea(area, next, url = null) {

    let self = this;

    if (url === null) {
      url = 'https://graph.facebook.com/v2.9/search';
      let parameters = this.getRequestParameters(area);

      url += `?${parameters}`;
    }

    request(url, (err, response, data) => {

      if (err) {
        console.error(err.message);
        return;
      }

      if (response.statusCode != 200) {
        console.error(response.statusCode);
        console.error(data);
        return;
      }

      let body = JSON.parse(data);

      let locations = body.data.map((location) => {
        return {
          'name': location.name,
          'facebookID': location.id,
        };
      });
      each(
        locations,
        (location, next2) => {
          Location.create(location, (err, _) => {
             if (err)
               console.error(err.message);
            next2();
          });
        },
        (err) => {
          if (body.paging)
            self.importFromArea(area, next, body.paging.next);
          else {
            next();
          }
        }
      );
    });
  }

  getRequestParameters(area) {

    let parameters = new Map();
    parameters.set('access_token', this.accessToken);
    parameters.set('type', 'place');
    parameters.set('center', `${area.latitude},${area.longitude}`);
    parameters.set('distance', area.radius + 1000);

    let requestParameters = '';
    for (let [key, value] of parameters.entries())
      if (requestParameters == '')
        requestParameters += `${key}=${value}`;
      else
        requestParameters += `&${key}=${value}`;

    return requestParameters;
  }
}
