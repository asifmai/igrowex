const validator = require('validator');

const Customer = require('../models/Customer');

module.exports.customers_get = async (req, res) => {
  try {
    // Process
    const data = await Customer.find({ user: req.user._id });

    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.log('customers_get error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.customers_post = async (req, res) => {
  try {
    // Fetch Data from Request
    const name = req.body.name ? req.body.name.trim() : '';
    const email = req.body.email ? req.body.email.trim() : '';
    const occupation = req.body.occupation ? req.body.occupation.trim() : '';
    const phone = req.body.phone ? req.body.phone.trim() : '';
    const location = req.body.location ? req.body.location.trim() : '';

    // Validators
    const errors = [];
    if (
      validator.isEmpty(name) ||
      validator.isEmpty(email) ||
      validator.isEmpty(occupation) ||
      validator.isEmpty(phone) ||
      validator.isEmpty(location)
    ) {
      errors.push('name, email, occupation, phone and location is required');
    }
    if (!validator.isEmail(email)) {
      errors.push('Email not valid');
    }
    let foundCustomer = await Customer.findOne({ user: req.user._id, email });
    if (foundCustomer) {
      errors.push('Email already added');
    }
    foundCustomer = await Customer.findOne({ user: req.user._id, phone });
    if (foundCustomer) {
      errors.push('Phone already added');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    const newCustomer = new Customer({
      user: req.user._id,
      name,
      email,
      occupation,
      phone,
      location,
    });
    await newCustomer.save();

    res.status(200).json({ status: 200, data: newCustomer });
  } catch (error) {
    console.log('customers_post error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.customers_delete = async (req, res) => {
  try {
    // Fetch Data from Request
    const { id } = req.params;

    // Process
    await Customer.findByIdAndDelete(id);

    res.status(200).json({ status: 200, data: 'Customer deleted' });
  } catch (error) {
    console.log('customers_delete error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.customers_put = async (req, res) => {
  try {
    // Fetch Data from Request
    const customerId = req.body.customerId ? req.body.customerId.trim() : '';
    const name = req.body.name ? req.body.name.trim() : '';
    const email = req.body.email ? req.body.email.trim() : '';
    const occupation = req.body.occupation ? req.body.occupation.trim() : '';
    const phone = req.body.phone ? req.body.phone.trim() : '';
    const location = req.body.location ? req.body.location.trim() : '';

    // Validators
    const errors = [];
    if (
      validator.isEmpty(customerId) ||
      validator.isEmpty(name) ||
      validator.isEmpty(email) ||
      validator.isEmpty(occupation) ||
      validator.isEmpty(phone) ||
      validator.isEmpty(location)
    ) {
      errors.push('customerId, name, email, occupation, phone and location is required');
    }
    if (!validator.isEmail(email)) {
      errors.push('Email not valid');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    await Customer.findByIdAndUpdate(customerId, {
      name,
      email,
      occupation,
      phone,
      location,
      updatedAt: new Date(),
    });
    const data = await Customer.findById(customerId);

    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.log('customers_put error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.customers_delete_multiple_post = async (req, res) => {
  try {
    // Fetch Data from Request
    const customers = req.body.customers ? req.body.customers : '';

    // Validators
    const errors = [];
    if (customers == '') {
      errors.push('customers array is required');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    await Customer.deleteMany({ _id: { $in: customers } });

    res.status(200).json({ status: 200, data: 'Multiple customers deleted' });
  } catch (error) {
    console.log('customers_delete_multiple_post error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};
