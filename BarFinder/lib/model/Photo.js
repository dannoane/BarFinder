const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var photoSchema = new Schema({
  source: { type: String, required: true, unique: true, index: true },
  _location: { type: Schema.Types.ObjectId, ref: 'Location' },
});

photoSchema.pre('validate', function (next) {

  this.constructor.findOne({ 'source' : this.source, '_id' : { $ne : this._id } }, function (err, photo) {

    let error = null;

    if (err)
      error = new Error('Failed to save photo!');
    if (photo)
      error = new Error('A photo with this source already exists!');

    next(error);
  });
});

var Photo = mongoose.model('Photo', photoSchema);

module.exports.Photo = Photo;
module.exports.mongoose = mongoose;
