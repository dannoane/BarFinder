const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var eventSchema = new Schema({
  name: { type: String, required: true, index: true },
  facebookID: { type: String, required: true, index: true },
  description: String,
  attending: Number,
  interested: Number,
  maybe: Number,
  startTime: Date,
  endTime: Date,
  category: String,
  type: String,
  cover: String,
  _location: { type: Schema.Types.ObjectId, ref: 'Location' },
});

eventSchema.pre('validate', function (next) {

  this.constructor.findOne({ 'facebookID' : this.facebookID, '_id' : { $ne : this._id } }, function (err, event) {

    let error = null;

    if (err)
      error = new Error('Failed to save event!');
    if (event)
      error = new Error('The event already exists!');

    next(error);
  });
});

var Event = mongoose.model('Event', eventSchema);

module.exports.Event = Event;
module.exports.mongoose = mongoose;
