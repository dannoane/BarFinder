const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

var groupSchema = new Schema({
  name: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  _location: { type: Schema.Types.ObjectId, ref: 'Location' },
  _admin: { type: Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

var Group = mongoose.model('Group', groupSchema);

module.exports.Group = Group;
module.exports.mongoose = mongoose;
