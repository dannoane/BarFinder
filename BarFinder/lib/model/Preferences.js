const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var preferencesSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  attires: [{ type: Schema.Types.ObjectId, ref: 'Attire' }],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  foodStyles: [{ type: Schema.Types.ObjectId, ref: 'FoodStyle' }],
  paymentOptions: [{ type: Schema.Types.ObjectId, ref: 'PaymentOption' }],
  restaurantServices: [{ type: Schema.Types.ObjectId, ref: 'RestaurantService' }],
  restaurantSpecialties: [{ type: Schema.Types.ObjectId, ref: 'RestaurantSpecialty' }],
  priceRange: String,
  latitude: Number,
  longitude: Number,
  radius: Number,
});

preferencesSchema.pre('validate', function (next) {

  this.constructor.findOne({ '_user' : this._user, '_id' : { $ne : this._id } }, function (err, preferences) {
    let error = null;

    if (err)
      error = new Error('Failed to validate preferences!');
    if (preferences)
      error = new Error('The user already has preferences!');

    next(error);
  });
});

var Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports.Preferences = Preferences;
module.exports.mongoose = mongoose;
