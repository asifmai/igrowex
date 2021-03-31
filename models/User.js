const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    trial: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    stripeCustomerId: String,
    lastCharged: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    links: {
      google: {
        url: String,
        active: {
          type: Boolean,
          default: true,
        },
      },
      yelp: {
        url: String,
        active: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  { timestamps: true }
);

// Encrypt the Password before Saving to DB
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const hash = await bcrypt.hash(user.password, 10);
  this.password = hash;
  next();
});

// Encrypt the Password before Updating
userSchema.pre('findOneAndUpdate', async function (next) {
  const updatedInfo = this.getUpdate();
  if (updatedInfo.password) {
    this._update.password = await bcrypt.hash(updatedInfo.password, 10);
  }
  next();
});

// Check if the password is correct
userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  console.log(compare);
  return compare;
};

userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
