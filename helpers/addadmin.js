const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = async () => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('admin', salt);

  const newAdmin = new User({
    profile: {
      firstName: 'Admin',
      lastName: 'Admin',
    },
    email: 'admin@admin.com',
    isAdmin: true,
    password: passwordHash,
  });
  await newAdmin.save();
  return;
}