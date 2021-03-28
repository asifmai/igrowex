const validator = require('validator');
const sendMessage = require('../helpers/sendmessage');
const csv = require('csvtojson');
const axios = require('axios');

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
    // const email = req.body.email ? req.body.email.trim() : '';
    // const occupation = req.body.occupation ? req.body.occupation.trim() : '';
    const phone = req.body.phone ? req.body.phone.trim() : '';
    // const location = req.body.location ? req.body.location.trim() : '';
    // const smsNotification = req.body.smsNotification;
    // const emailNotification = req.body.emailNotification;

    // Validators
    const errors = [];
    if (
      validator.isEmpty(name) ||
      // validator.isEmpty(email) ||
      // validator.isEmpty(occupation) ||
      validator.isEmpty(phone)
      // validator.isEmpty(location) ||
      // smsNotification === '' ||
      // emailNotification === ''
    ) {
      // errors.push('name, email, occupation, phone, location, smsNotification and emailNotification is required');
      errors.push('Name and Phone are Required!');
    }
    // if (!validator.isEmail(email)) {
    //   errors.push('Email not valid');
    // }
    // let foundCustomer = await Customer.findOne({ user: req.user._id, email });
    // if (foundCustomer) {
    //   errors.push('Email already added');
    // }
    let foundCustomer = await Customer.findOne({ user: req.user._id, phone });
    if (foundCustomer) {
      errors.push('Phone Already Added!');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    const newCustomer = new Customer({
      user: req.user._id,
      name,
      email: '',
      occupation: '',
      phone,
      location: '',
      smsNotification: true,
      emailNotification: true,
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
    // const email = req.body.email ? req.body.email.trim() : '';
    // const occupation = req.body.occupation ? req.body.occupation.trim() : '';
    const phone = req.body.phone ? req.body.phone.trim() : '';
    // const location = req.body.location ? req.body.location.trim() : '';
    // const smsNotification = req.body.smsNotification;
    // const emailNotification = req.body.emailNotification;

    // Validators
    const errors = [];
    if (
      validator.isEmpty(customerId) ||
      validator.isEmpty(name) ||
      // validator.isEmpty(email) ||
      // validator.isEmpty(occupation) ||
      validator.isEmpty(phone)
      // validator.isEmpty(location) ||
      // smsNotification === '' ||
      // emailNotification === ''
    ) {
      errors.push('Name and Phone are Required!');
    }
    // if (!validator.isEmail(email)) {
    //   errors.push('Email not valid');
    // }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    await Customer.findByIdAndUpdate(customerId, {
      name,
      phone,
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

module.exports.customers_send_message_get = async (req, res) => {
  try {
    // Fetch Data from Request
    const customerId = req.params.id;

    // Process
    try {
      await sendMessage(req.user._id, customerId);
      res.status(200).json({ status: 200, data: 'Sent' });
    } catch (error) {
      return res.status(400).json({ status: 400, data: error });
    }
  } catch (error) {
    console.log('customers_send_message_get error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.customers_upload_post = async (req, res) => {
  try {
    var buffer = req.files.myFile.data;
    const json = await csv().fromString(buffer.toString('utf8'));

    if (json.length) {
      for (let i = 0; i < json.length; i++) {
        if (!json[0].name && !json[0].phone) {
          return res.status(400).json({ status: 400, data: 'Invalid CSV' });
        }
      }
    } else {
      return res.status(400).json({ status: 400, data: 'Invalid CSV' });
    }

    for (let i = 0; i < json.length; i++) {
      const newCustomer = new Customer({
        user: req.user._id,
        name: json[i].name,
        email: '',
        occupation: '',
        phone: json[i].phone,
        location: '',
        smsNotification: true,
        emailNotification: true,
      });
      await newCustomer.save();
    }

    res.status(200).json({ status: 200, data: 'done' });
  } catch (error) {
    console.log('customers_upload_post error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};
