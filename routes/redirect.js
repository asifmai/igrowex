const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');

router.get('/:user/:customer', async (req, res) => {
  const userName = req.params.user;
  const customerId = req.params.customer;

  const emailRegEx = new RegExp(`^${userName}@\.*?\.*$`);
  const user = await User.find({ email: emailRegEx });

  const newReview = new Review({
    user: user._id,
    customer: customerId,
    type: user.links.google.active ? 'google' : 'yelp',
  });

  const redirectLink = user.links.google.active ? user.links.google.url : user.links.yelp.url;
  res.redirect(redirectLink);
});

module.exports = router;
