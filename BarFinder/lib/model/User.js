const mongoose = require('./../DBConnection').mongoose;
const Schema = mongoose.Schema;

const crypto = require('crypto');

var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

userSchema.pre('validate', function (next) {
  this.constructor.findOne({'username': this.username}, (err, user) => {
    let error = null;

    if (err)
      error = new Error('Failed to save user!');
    if (user)
      error = new Error('A user with this username already exists!');

    next(error);
  });
});

userSchema.pre('validate', function (next) {
  this.constructor.findOne({'email': this.email}, (err, user) => {
    let error = null;

    if (err)
      error = new Error('Failed to save user!');
    if (user)
      error = new Error('An account with this email already exists!');

    next(error);
  });
});

userSchema.pre('validate', function (next) {
  if (this.password.length < 8) {
    let error = new Error('Password must be at least 8 characters long!');
    next(error);
  }
  else
    next();
});

userSchema.pre('save', function (next) {
  const hash = crypto.createHash('sha256');
  hash.update(this.password);
  this.password = hash.digest('hex');

  next();
});

userSchema.pre('save', function (next) {
  this.username = this.username.toLowerCase();

  next();
});

var User = mongoose.model('User', userSchema);

module.exports.User = User;
