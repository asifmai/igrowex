const mongoose = require('mongoose');
const User = require('../models/User');
const addAdmin = require('./addadmin');

module.exports = () => new Promise(async (resolve, reject) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    // mongoose.set('debug', true);
    console.log('MongoDB Connected...');
    const admin = await User.findOne({isAdmin: true});
    if (!admin) {
      console.log('Admin User not found. Making now');
      await addAdmin();
    }

    resolve(true);
  } catch (error) {
    console.log('MongoDB Connection Error: ', error);
    reject(error);
  }
});