const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/barfinder');

module.exports.mongoose = mongoose;
