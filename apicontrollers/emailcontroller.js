const validator = require('validator');
const mailer = require('../helpers/mailer');

module.exports.sendmail = async (req, res) => {
  try {
    // Fetch Data from Request
    const name = req.body.name ? req.body.name.trim() : '';
    const subject = req.body.subject ? req.body.subject.trim() : '';
    const message = req.body.message ? req.body.message.trim() : '';

    // Validators
    const errors = [];
    if (validator.isEmpty(name) || validator.isEmpty(subject) || validator.isEmpty(message)) {
      errors.push('name, toEmail, subject and body is required');
    }
    if (!validator.isEmail(toEmail)) errors.push('email is invalid');

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    mailer.sendMail({
      name,
      subject,
      message,
    });

    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.log('sendmail error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};
