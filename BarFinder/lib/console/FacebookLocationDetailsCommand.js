#!/usr/bin/env node

var program = require('commander');
var City = require('./../model/City').City;
var Platform = require('./../model/Platform').Platform;
var FacebookLocationDetails = require('./../import/FacebookLocationDetails').FacebookLocationDetails;

program
  .version('1.0.0')
  .option('-c, --city <name>', 'City from which to import location details')
  .parse(process.argv);

if (!program.city)
  program.help()

let cityPromise = City.findOne({ 'name' : program.city }).exec();
let platformPromise = Platform.findOne({ 'name' : 'facebook' }).exec();

cityPromise.then(function (city) {

  if (!city) {
    console.error('City not found!');
    return;
  }

  platformPromise.then(function (platform) {

    if (!platform) {
      console.error('Platform not found!');
      return;
    }

    var facebookLocationDetails = new FacebookLocationDetails(city, platform.accessToken);
    facebookLocationDetails.import();
  });
});
