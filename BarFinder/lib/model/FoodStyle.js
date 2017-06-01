const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var foodStyleSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
});

foodStyleSchema.pre('validate', function (next) {

  this.constructor.findOne({ 'name' : this.name, '_id' : { $ne : this._id } }, function (err, foodStyle) {

    let error = null;

    if (err)
      error = new Error('Failed to save foodStyle!');
    if (foodStyle)
      error = new Error('A foodStyle with this name already exists!');

    next(error);
  });
});

var FoodStyle = mongoose.model('FoodStyle', foodStyleSchema);

module.exports.FoodStyle = FoodStyle;
module.exports.mongoose = mongoose;
