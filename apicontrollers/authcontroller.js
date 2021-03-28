const User = require('../models/User');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function generateTokenResponse(user) {
  const userInfo = {
    id: user._id,
  };

  return {
    token: 'Bearer ' + jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY }),
    user,
  };
}

module.exports.login_post = async function (req, res, next) {
  await User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() });
  return res.status(200).json({ status: 200, data: generateTokenResponse(req.user) });
};

module.exports.me_get = async (req, res, next) => {
  const user = req.user;
  await User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() });
  if (req.user.stripeCustomerId) {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card',
    });
    user.paymentMethods = paymentMethods.data;
  }

  return res.status(200).json({ status: 200, data: req.user });
};
