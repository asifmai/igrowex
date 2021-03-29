const User = require('../models/User');
const Customer = require('../models/Customer');
const Template = require('../models/Template');
const Message = require('../models/Message');
const axios = require('axios');

const twilio = require('./twilio');
const mailer = require('./mailer');

module.exports = (userId, customerId) =>
  new Promise(async (resolve, reject) => {
    try {
      // Fetch Data
      const errors = [];
      const user = await User.findById(userId).lean();
      const customer = await Customer.findById(customerId).lean();

      // Validation
      if (!user.phone) {
        errors.push('You have not been assigned a phone yet');
      }
      // See if templates are created by user
      const templates = await Template.find({ user: userId });
      if (templates.length == 0) errors.push('Please add a Template');

      // See if a template is selected
      const selectedTemplate = templates.find((t) => t.selected);
      if (!selectedTemplate) errors.push('Please select a Template');

      // See if one of the links are filled
      const activeLink = user.links.google.active ? user.links.google : user.links.yelp;
      if (activeLink.url == '') errors.push('Please select Google or Yelp');

      if (errors.length) return reject(errors);

      // Process
      const redirectUrl = `${process.env.BACKEND_URL}/redirect/${user.email.match(/^.*(?=@)/gi)[0]}/${customerId}`;
      const response = await axios.get(`https://cutt.ly/api/api.php?key=${process.env.CUTTLY_KEY}&short=${encodeURIComponent(redirectUrl)}`);
      const messageBody = `${selectedTemplate.body}\n${response.data.url.shortLink}`;
      // const messageBodyEmail = `${selectedTemplate.body}<br /><a href="${redirectUrl}">${redirectUrl}</a>`;
      if (customer.smsNotification) {
        await twilio.sendMesage(customer.phone, messageBody, user.phone);
        const newMessage = new Message({
          user: userId,
          customer: customerId,
          type: 'sms',
        });
        await newMessage.save();
      }
      // if (customer.emailNotification) {
      //   await mailer.sendMailToCustomer(customer.email, messageBodyEmail);
      //   const newMessage = Message({
      //     user: userId,
      //     customer: customerId,
      //     type: 'email',
      //   });
      //   await newMessage.save();
      // }

      resolve(true);
    } catch (error) {
      console.log(`sendMessage error: ${error.stack}`);
      reject(error);
    }
  });
