const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var restaurantSpecialtySchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
});

restaurantSpecialtySchema.pre('validate', function (next) {

  this.constructor.findOne({ 'name' : this.name }, function (err, restaurantSpecialty) {

    let error = null;

    if (err)
      error = new Error('Failed to save restaurantSpecialty!');
    if (location)
      error = new Error('A restaurantSpecialty with this name already exists!');

    next(error);
  });
});

var RestaurantSpecialty = mongoose.model('RestaurantSpecialty', restaurantSpecialtySchema);

module.exports.RestaurantSpecialty = RestaurantSpecialty;
module.exports.mongoose = mongoose;
