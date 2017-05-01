const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var locationSchema = new Schema({
  name: { type: String, required: true, index: true },
  facebookID: { type: String, required: true, unique: true, index: true },
  _city: {type: Schema.Types.ObjectId, ref: 'City' },
});

locationSchema.pre('validate', true, function (next, done) {

  this.constructor.findOne({ 'facebookID' : this.facebookID }, function (err, location) {
    let error = null;

    if (err)
      error = new Error('Failed to save location!');
    if (location)
      error = new Error('A location with this facebookID already exists!');

    done(error);
  });

  next(null);
});

var Location = mongoose.model('Location', locationSchema);

module.exports.Location = Location;
module.exports.mongoose = mongoose;
