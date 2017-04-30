const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var platformSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  clientID: String,
  clientSecret: String,
  accessToken: String,
});

var Platform = mongoose.model('Platform', platformSchema);

module.exports.Platform = Platform;
module.exports.mongoose = mongoose;
