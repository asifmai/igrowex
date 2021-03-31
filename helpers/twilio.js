const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.sendMesage = (phoneNumber, smsBody, twilioPhone, userName) =>
  new Promise(async (resolve, reject) => {
    try {
      client.messages
        .create({
          body: smsBody,
          // from: process.env.TWILIO_FROM_NUMBER,
          from: userName,
          // from: twilioPhone,
          to: phoneNumber,
        })
        .then((message) => {
          console.log(`Twilio Message Sent to ${phoneNumber} with SID: ${message.sid}`);
          resolve(true);
        });
    } catch (error) {
      console.log(`Twilio Message Send Error: ${error.stack}`);
      reject(error);
    }
  });
