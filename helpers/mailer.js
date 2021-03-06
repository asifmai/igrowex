const nodemailer = require('nodemailer');

module.exports.sendMail = async (options) =>
  new Promise(async (resolve, reject) => {
    try {
      const account = await nodemailer.createTestAccount();

      let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: { user: process.env.OUTLOOK_USER, pass: process.env.OUTLOOK_PASSWORD },
      });

      const mailOptions = {
        from: `Contact Us <${process.env.OUTLOOK_USER}>`,
        // to: process.env.OUTLOOK_USER,
        to: 'asifmai@hotmail.com',
        subject: options.subject,
        html: generateEmailBody(options),
        // text: 'Hello World!'
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
