const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var Attire = require('./Attire').Attire;
var Category = require('./Category').Category;
var RestaurantService = require('./RestaurantService').RestaurantService;
var RestaurantSpecialty = require('./RestaurantSpecialty').RestaurantSpecialty;
var FoodStyle = require('./FoodStyle').FoodStyle;
var PaymentOption = require('./PaymentOption').PaymentOption;

var locationSchema = new Schema({
  name: { type: String, required: true, index: true },
  facebookID: { type: String, required: true, unique: true, index: true },
  _city: { type: Schema.Types.ObjectId, ref: 'City' },
  about: String,
  latitude: Number,
  longitude: Number,
  street: String,
  checkins: Number,
  description: String,
  hours: Schema.Types.Mixed,
  impressum: String,
  rating: Number,
  parking: {
    lot: Number,
    street: Number,
    valet: Number,
  },
  phone: String,
  priceRange: String,
  ratingCount: Number,
  publicTransit: String,
  _attire: { type: Schema.Types.ObjectId, ref: 'Attire' },
  _category: { type: Schema.Types.ObjectId, ref: 'Category' },
  foodStyles: [{ type: Schema.Types.ObjectId, ref: 'FoodStyle' }],
  paymentOptions: [{ type: Schema.Types.ObjectId, ref: 'PaymentOption' }],
  restaurantServices: [{ type: Schema.Types.ObjectId, ref: 'RestaurantService' }],
  restaurantSpecialties: [{ type: Schema.Types.ObjectId, ref: 'RestaurantSpecialty' }],
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

locationSchema.pre('validate', function (next) {

  this.constructor.findOne({ 'facebookID' : this.facebookID, '_id' : { $ne : this._id } }, function (err, location) {
    let error = null;

    if (err)
      error = new Error('Failed to save location!');
    if (location)
      error = new Error('A location with this facebookID already exists!');

    next(error);
  });
});

var Location = mongoose.model('Location', locationSchema);

module.exports.Location = Location;
module.exports.mongoose = mongoose;
