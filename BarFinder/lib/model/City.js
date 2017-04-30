const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var citySchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true },
});

var City = mongoose.model('City', citySchema);

module.exports.City = City;
module.exports.mongoose = mongoose;
