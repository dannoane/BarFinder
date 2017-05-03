const request = require('request');
const each = require('async-each-series');
const Location = require('./../model/Location').Location;
const Event = require('./../model/Event').Event;

module.exports.FacebookEvent = class FacebookEvent {

  constructor(city, accessToken) {

    this.city = city;
    this.accessToken = accessToken;
  }

  import() {

    let self = this;

    Location
      .find({'facebookID' : '292032007490294'})
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

  importFromLocation(location, next, url = null) {

    let self = this;

    if (url == null) {
      url = 'https://graph.facebook.com/v2.9/' + location.facebookID;
      let parameters = this.getRequestParameters();

      url += `?${parameters}`;
    }

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

      let body = JSON.parse(data).events;
      each(
        body.data,
        (event, cb) => {
          let startDate = new Date(event.start_time);
          let currentDate = new Date();

          if (startDate < currentDate) {
            cb();
            return;
          }

          Event.findOne({ 'facebookID' : event.id }, (err, result) => {

            if (err || result) {
              cb(err);
              return;
            }

            let newEvent = Event({
              'name': event.name,
              'facebookID': event.id,
              'description': event.description,
              'attending': event.attending_count,
              'interested': event.interested_count,
              'maybe': event.maybe_count,
              'startTime': event.start_time,
              'endTime': event.end_time,
              'category': event.category,
              'type': event.type,
              'cover': event.cover.source,
              '_location': location.id,
            });

            newEvent.save((err, result) => {

              cb(err);
            });
          });
        },
        (err) => {

          if (err)
            console.error(err.message);

          let lastDate;
          let currentDate = new Date();
          if (body.data.length > 0)
            lastDate = new Date(body.data[body.data.length - 1].start_time);
          if (body.paging && lastDate > currentDate)
            self.importFromLocation(location, next, body.paging.next);
          else {
            next();
          }
        }
      );
    });
  }

  getRequestParameters() {

    let parameters = [
      'attending_count',
      'cover',
      'description',
      'interested_count',
      'maybe_count',
      'name',
      'start_time',
      'type',
      'end_time',
      'category',
    ];

    let requestParameters = `access_token=${this.accessToken}&fields=events{${parameters.join(',')}}`;

    return requestParameters;
  }
};
