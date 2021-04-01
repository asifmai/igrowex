const User = require('../models/User');

module.exports.users_get = async (req, res) => {
  const users = await User.find({ isAdmin: false }).sort({ firstName: 'asc' }).lean();

  res.render('users/users', { users });
};

module.exports.users_delete_get = async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  req.flash('success_msg', 'User Deleted!');
  res.redirect('/users');
};

module.exports.users_edit_get = async (req, res) => {
  const foundUser = await User.findById(req.params.id);

  res.render('users/edituser', { foundUser });
};

module.exports.users_edit_post = async (req, res) => {
  const { id } = req.params.id;
  await User.findByIdAndUpdate(req.params.id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    nameForMessage: req.body.nameForMessage,
  });

  req.flash('success_msg', 'User Updated!');
  res.redirect('/users');
};
