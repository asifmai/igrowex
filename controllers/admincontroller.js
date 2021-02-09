const passport = require('passport');

module.exports.admin_get = (req, res, next) => {
  res.render('dashboard');
}

// GET - Show admin sign in page
module.exports.login_get = (req, res, next) => {
  res.render('login');
}

// POST - admin sign in
module.exports.login_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Email or Password Incorrect...',
  })(req, res, next);
}

// GET - admin sign out
module.exports.logout_get = (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are Logged out!');
  res.redirect('/login');
}
