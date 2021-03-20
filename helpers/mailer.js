const nodemailer = require('nodemailer');

module.exports.sendContactMail = async (options) =>
  new Promise(async (resolve, reject) => {
    try {
      const account = await nodemailer.createTestAccount();

      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        requireTLS: true, //this parameter solved problem for me
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: `Contact Us <${process.env.GMAIL_USER}>`,
        to: 'info@igrowex.com',
        subject: options.subject,
        html: generateEmailBody(options),
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Message sent: %s ${info.messageId}`);
      resolve(true);
    } catch (error) {
      console.log(`sendMail Error: ${error}`);
      reject(error);
    }
  });

function generateEmailBody(options) {
  return `<h1 style="text-align:center;margin-bottom:2em;">
      Contact Us
    </h1>
    <h4 style="text-align:center;margin-bottom:2em;">
      Name
    </h4>
    <p>
      ${options.name}
    </p>
    <h4 style="text-align:center;margin-bottom:2em;">
      Subject
    </h4>
    <p>
      ${options.subject}
    </p>
    <h4 style="text-align:center;margin-bottom:2em;">
      Message
    </h4>
    <p>
      ${options.message}
    </p>
    `;
}

module.exports.sendMailToCustomer = async (customerEmail, subject, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const account = await nodemailer.createTestAccount();

      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        requireTLS: true, //this parameter solved problem for me
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: `Contact Us <${process.env.GMAIL_USER}>`,
        to: customerEmail,
        subject,
        text: body,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Message sent: %s ${info.messageId}`);
      resolve(true);
    } catch (error) {
      console.log(`sendMail Error: ${error}`);
      reject(error);
    }
  });
