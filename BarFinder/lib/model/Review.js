const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var reviewSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _location: { type: Schema.Types.ObjectId, ref: 'Location' },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

reviewSchema.pre('validate', function (next) {

  this.constructor.findOne({'_user' : this._user, '_location' : this._location}, function (err, review) {
    let error = null;

    if (err)
      error = new Error('Failed to validate review!');
    if (review)
      error = new Error('The user already reviewed this location!');

    next(error);
  });
});

var Review = mongoose.model('Review', reviewSchema);

module.exports.Review = Review;
module.exports.mongoose = mongoose;
