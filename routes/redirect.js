const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');

router.get('/:user/:customer', async (req, res) => {
  const userName = req.params.user;
  const customerId = req.params.customer;

  const emailRegEx = new RegExp(`^${userName}@\.*?\.*$`);
  const user = await User.find({ email: emailRegEx });
  console.log(user);
});

module.exports = router;
