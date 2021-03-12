const validator = require('validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

function generateTokenResponse(user) {
  const userInfo = {
    id: user._id,
  };

  return {
    token: 'Bearer ' + jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY }),
    user,
  };
}

module.exports.register_post = async (req, res) => {
  const email = req.body.email ? req.body.email.trim() : '';
  const password = req.body.password ? req.body.password.trim() : '';
  const firstName = req.body.firstName ? req.body.firstName.trim() : '';
  const lastName = req.body.lastName ? req.body.lastName.trim() : '';

  const errors = [];
  if (validator.isEmpty(firstName) || validator.isEmpty(lastName) || validator.isEmpty(email) || validator.isEmpty(password)) {
    errors.push('name, email, firstName and lastName are required');
  }
  if (!validator.isEmail(email)) errors.push('Email is not valid');
  if (!validator.isByteLength(password, { min: 6 })) errors.push('Password must be at least 6 characters');

  if (errors.length > 0) {
    return res.status(400).json({ status: 400, data: errors });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ status: 400, data: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
    });
    await user.save();

    res.status(200).json({ status: 200, data: generateTokenResponse(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.users_billing_post = async (req, res) => {
  try {
    // Fetch Data from Request
    const creditCard = req.body.creditCard ? req.body.creditCard.trim() : '';
    const date = req.body.date ? req.body.date.trim() : '';
    const cvv = req.body.cvv ? req.body.cvv : '';

    // Validators
    const errors = [];
    if (validator.isEmpty(creditCard) || validator.isEmpty(date) || cvv === '') {
      errors.push('creditCard, date and cvv are required');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    await User.findByIdAndUpdate(req.user._id, {
      billing: {
        creditCard,
        date,
        cvv,
      },
    });

    res.status(200).json({ status: 200, data: 'updated' });
  } catch (error) {
    console.log('users_billing_post error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.users_links_post = async (req, res) => {
  try {
    // Fetch Data from Request
    const google = req.body.google ? req.body.google.trim() : '';
    const yelp = req.body.yelp ? req.body.yelp.trim() : '';

    // Validators
    const errors = [];
    if (validator.isEmpty(google) || validator.isEmpty(yelp)) {
      errors.push('google and yelp are required');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    await User.findByIdAndUpdate(req.user._id, {
      links: {
        google,
        yelp,
      },
    });

    res.status(200).json({ status: 200, data: 'updated' });
  } catch (error) {
    console.log('users_links_post error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};
