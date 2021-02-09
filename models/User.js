const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.virtual('fullName').get(function() {
  return this.profile.firstName + ' ' + this.profile.lastName
})

userSchema.set('toObject', {virtuals: true})
userSchema.set('toJSON', {virtuals: true})

module.exports = mongoose.model('User', userSchema);