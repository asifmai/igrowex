const User = require('../models/User');
const moment = require('moment');
const monthlyChargeAmount = process.env.MONTHLY_CHARGE;
let users = [];

module.exports.chargeUsers = async () =>
  new Promise(async (resolve, reject) => {
    try {
      users = await User.find();
      await chargeTrials();
    } catch (error) {
      console.log(`chargeUsers Error: ${error.stack}`);
      reject(error);
    }
  });

const chargeTrials = async () =>
  new Promise(async (resolve, reject) => {
    try {
      // Filter Trial Users
      const trialUsers = users.filter((user) => user.trial);

      for (let i = 0; i < trialUsers.length; i++) {
        // See if Trial Period 14 days has completed
        const userJoiningDate = moment(trialUsers[i].createdAt);
        const todayDate = moment();
        const timeSinceJoined = todayDate.diff(userJoiningDate, 'days');
        if (timeSinceJoined > 14) {
          // Get User's Payment Methods
          const userPaymentMethodsResponse = await stripe.paymentMethods.list({
            customer: trialUsers[i].stripeCustomerId,
            type: 'card',
          });
          const userPaymentMethods = userPaymentMethodsResponse.data;
          if (userPaymentMethods.length == 0) {
            // Make User inactive if Payment Method was not added
            await User.findByIdAndUpdate(trialUsers[i]._id, { active: false });
          } else {
            // Charge the User if Payment Method was added
            const transactionDescription = `Charged New User ${user.fullName} after trial period`;
            const paymentIntentCreateObject = {
              amount: monthlyChargeAmount * 100,
              currency: 'usd',
              customer: trialUsers[i].stripeCustomerId,
              payment_method: userPaymentMethods[0].id,
              off_session: true,
              confirm: true,
              description: transactionDescription,
            };
            try {
              const paymentIntent = await stripe.paymentIntents.create(paymentIntentCreateObject);
            } catch (error) {}
          }
        }
      }
    } catch (error) {
      console.log(`chargeTrials Error: ${error}`);
      reject(error);
    }
  });
