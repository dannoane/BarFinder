const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var paymentOptionSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
});

paymentOptionSchema.pre('validate', function (next) {

  this.constructor.findOne({ 'name' : this.name }, function (err, paymentOption) {

    let error = null;

    if (err)
      error = new Error('Failed to save paymentOption!');
    if (paymentOption)
      error = new Error('A paymentOption with this name already exists!');

    next(error);
  });
});

var PaymentOption = mongoose.model('PaymentOption', paymentOptionSchema);

module.exports.PaymentOption = PaymentOption;
module.exports.mongoose = mongoose;
