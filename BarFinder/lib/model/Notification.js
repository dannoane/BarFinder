const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var notificationSchema = new Schema({
  text: { type: String, required: true, index: true },
  path: { type: String, required: true },
});

var Notification = mongoose.model('Notification', notificationSchema);

module.exports.Notification = Notification;
module.exports.mongoose = mongoose;
