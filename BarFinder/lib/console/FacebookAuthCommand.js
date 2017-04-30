#!/usr/bin/env node

var program = require('commander');
var Platform = require('./../model/Platform').Platform;
var FacebookAuth = require('./../auth/FacebookAuth').FacebookAuth;

program
  .version('1.0.0')
  .parse(process.argv);

Platform.findOne({'name' : 'facebook'})
  .then((platform) => {
    var facebookAuth = new FacebookAuth(platform.clientID, platform.clientSecret);
    facebookAuth.generateAccessToken();
  })
  .catch((err) => {
    console.error(err.message);
  });
