const validator = require('validator');
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

    const customer = await stripe.customers.create({
      email,
      name: firstName + ' ' + lastName,
      description: 'User on igrowex',
    });

    user = new User({
      firstName,
      lastName,
      email,
      password,
      stripeCustomerId: customer.id,
      links: {
        google: {
          url: '',
        },
        yelp: {
          url: '',
        },
      },
    });
    await user.save();

    res.status(200).json({ status: 200, data: generateTokenResponse(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.users_links_post = async (req, res) => {
  try {
    // Fetch Data from Request
    const google = req.body.google ? req.body.google : '';
    const yelp = req.body.yelp ? req.body.yelp : '';

    // Validators
    const errors = [];
    if (google == '' || yelp == '') {
      errors.push('google and yelp are required');
    }
    if (validator.isEmpty(google.url) || validator.isEmpty(yelp.url)) {
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

module.exports.setupcard_get = async (req, res) => {
  try {
    // Process
    const intent = await stripe.setupIntents.create({
      customer: req.user.stripeCustomerId,
    });

    res.status(200).json({ status: 200, data: intent.client_secret });
  } catch (error) {
    console.log('setupcard_get error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.removecard_post = async (req, res) => {
  try {
    // Fetch Data from Request
    const pmId = req.body.pmId ? req.body.pmId.trim() : '';

    // Validators
    const errors = [];
    if (validator.isEmpty(pmId)) {
      errors.push('pmId is required');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    const paymentMethod = await stripe.paymentMethods.detach(pmId);

    res.status(200).json({ status: 200, data: 'Removed' });
  } catch (error) {
    console.log('removecard_post error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};
