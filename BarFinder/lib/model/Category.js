const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
});

categorySchema.pre('validate', function (next) {

  this.constructor.findOne({ 'name' : this.name }, function (err, category) {

    let error = null;

    if (err)
      error = new Error('Failed to save category!');
    if (location)
      error = new Error('A category with this name already exists!');

    next(error);
  });
});

var Category = mongoose.model('Category', categorySchema);

module.exports.Category = Category;
module.exports.mongoose = mongoose;
