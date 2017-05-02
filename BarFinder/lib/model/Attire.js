const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var attireSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
});

attireSchema.pre('validate', function (next) {

  this.constructor.findOne({ 'name' : this.name }, function (err, attire) {

    let error = null;

    if (err)
      error = new Error('Failed to save attire!');
    if (attire)
      error = new Error('A attire with this name already exists!');

    next(error);
  });
});

var Attire = mongoose.model('Attire', attireSchema);

module.exports.Attire = Attire;
module.exports.mongoose = mongoose;
