const mongoose = require('mongoose');

// Create User Schema
const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    occupation: String,
    phone: String,
    location: String,
    smsNotification: Boolean,
    emailNotification: Boolean,
  },
  { timestamps: true }
);

customerSchema.set('toObject', { virtuals: true });
customerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Customer', customerSchema);
