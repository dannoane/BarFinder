const mongoose = require('./../DBConnection').mongoose;
const request = require('request');
const async = require('async');
const bl = require('bl');
var Location = require('./../model/Location');

module.exports.FacebookLocation = class FacebookLocation {

  constructor(city, accessToken) {

    this.city = city;
    this.accessToken = accessToken;
  }

  import(url = null) {

    let self = this;

    if (url === null) {
      url = 'https://graph.facebook.com/v2.9/search';
      let parameters = this.getRequestParameters();

      url += `?${parameters}`;
    }

    request
      .get({
        'uri': url,
        'encoding': 'utf-8',
      })
      .on('response', (response) => {

        response.pipe(bl((err, data) => {

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
          async.eachSeries(
            body.data,
            (location, asyncDone) => {
              let newLocation = Location.Location({
                'name': location.name,
                'facebookID': location.id,
              });

              newLocation.save(asyncDone);
            },
            (err, _) => {
              if (body.paging)
                self.import(body.paging.next);
              else
                Location.mongoose.disconnect();
            }
          );
        }));
      })
      .on('error', (err) => {
        console.error(err.message);
      });
  }

  getRequestParameters() {

    let parameters = new Map();
    parameters.set('access_token', this.accessToken);
    parameters.set('type', 'place');
    parameters.set('center', `${this.city.latitude},${this.city.longitude}`);
    parameters.set('distance', this.city.radius);

    let requestParameters = '';
    for (let [key, value] of parameters.entries())
      if (requestParameters == '')
        requestParameters += `${key}=${value}`;
      else
        requestParameters += `&${key}=${value}`;

    return requestParameters;
  }
}
