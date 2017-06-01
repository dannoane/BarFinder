const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var restaurantServiceSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
});

restaurantServiceSchema.pre('validate', function (next) {

  this.constructor.findOne({ 'name' : this.name, '_id' : { $ne : this._id } }, function (err, restaurantService) {

    let error = null;

    if (err)
      error = new Error('Failed to save restaurantService!');
    if (restaurantService)
      error = new Error('A restaurantService with this name already exists!');

    next(error);
  });
});

var RestaurantService = mongoose.model('RestaurantService', restaurantServiceSchema);

module.exports.RestaurantService = RestaurantService;
module.exports.mongoose = mongoose;
