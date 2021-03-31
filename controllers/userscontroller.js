const User = require('../models/User');

module.exports.users_get = async (req, res) => {
  const users = await User.find({ isAdmin: false }).sort({ firstName: 'asc' }).lean();

  res.render('users/users', { users });
};
