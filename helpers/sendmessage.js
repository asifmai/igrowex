const User = require('../models/User');
const Customer = require('../models/Customer');
const Template = require('../models/Template');
const Message = require('../models/Message');

const twilio = require('./twilio');
const mailer = require('./mailer');

module.exports = (userId, customerId) =>
  new Promise(async (resolve, reject) => {
    try {
      // Fetch Data
      const errors = [];
      const user = await User.findById(userId);
      const customer = await Customer.findById(customerId);

      // Validation
      // See if templates are created by user
      const templates = await Template.find({ user: userId });
      if (templates.length == 0) errors.push('Please add a template first');

      // See if a template is selected
      const selectedTemplate = templates.find((t) => t.selected);
      if (!selectedTemplate) errors.push('Please select a template first');

      // See if one of the links are filled
      const userLinks = user.links;
      if (userLinks.google.url == '' && userLinks.yelp.url == '') errors.push('Please enter google or yelp url first');

      // See if a link is selected
      if (!userLinks.google.active && !userLinks.yelp.active) errors.push('Please select google or yelp url');

      if (errors.length) return reject(errors);

      // Process
      const selectedLink = user.links.google.active ? user.links.google.url : user.links.yelp.url;
      const messageBody = `${selectedTemplate.body}\n${selectedLink}`;
      if (customer.smsNotification) {
        await twilio.sendMesage(customer.phone, messageBody);
        const newMessage = new Message({
          user: userId,
          customer: customerId,
          type: 'sms',
        });
        await newMessage.save();
      }
      if (customer.emailNotification) {
        await mailer.sendMailToCustomer(customer.email, messageBody);
        const newMessage = Message({
          user: userId,
          customer: customerId,
          type: 'email',
        });
        await newMessage.save();
      }

      resolve(true);
    } catch (error) {
      console.log(`sendMessage error: ${error.stack}`);
      reject(error);
    }
  });
