const User = require('../models/User');

module.exports.users_get = async (req, res) => {
  const users = await User.find({ isAdmin: false }).sort({ firstName: 'asc' }).lean();

  res.render('users/users', { users });
};

module.exports.users_addphone_post = async (req, res) => {
  await User.findByIdAndUpdate(req.body.userid, { phone: req.body.phone });
  req.flash('success_msg', 'Twilio Phone added for user');
  res.redirect('/users');
};
