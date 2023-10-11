const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: [true, 'This email is already taken'],
    lowercase: true, // convert to lowercase
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  photo: {
    // the user photo
    type: String,
    default: 'default.jpg'
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false // never show the password in any output
  },
  passwordChangedAt: Date,
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password confirmation'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(value) {
        return value === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    // this is used to delete a user from the database
    type: Boolean,
    default: true,
    select: false // never show the active property in any output
  }
});
userSchema.pre('save', async function(next) {
  //  this refers to the current document being processed
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12); // we don't need to save it in the database as it is already will be saved in the database

  // Delete passwordConfirm field // we don't need to save it in the database
  //  undefined is used to delete a field from the document in database
  this.passwordConfirm = undefined;
  next();
});
// userSchema.pre('save', async function(next) {
//   //  here we check if the password is modified and the document is new or the document is modified and the password is modified
//   if (!this.isModified('password') || this.isNew) return next();
//   //  here we set the passwordChangedAt property to the current time
//   this.passwordChangedAt = Date.now() - 1000; // we subtract 1 second from the current time to make sure that the token is created after the password is changed because sometimes the token is created before the password is changed

//   next();
// });
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } }); // this will filter out the documents that have the active property set to false
  next();
});
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.passwordChanged = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    // console.log(changedTimestamp < JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
userSchema.methods.passwordGenerateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); // generate a random string
  this.passwordResetToken = crypto // encrypt the random string and save it in the database
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); // we need to save the encrypted token in the database
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes create an expiration date for the token
  return resetToken; // return the reset token to send it to the user email
};
const User = mongoose.model('User', userSchema); // create in the database a collection named 'User' with the schema 'userSchema'
module.exports = User;
