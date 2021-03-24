const Message = require('../models/Message');
const Customer = require('../models/Customer');
const Review = require('../models/Review');

module.exports.dashboard_get = async (req, res) => {
  try {
    // Process
    const dashboardData = {};
    dashboardData.messages = await Message.find({ user: req.user._id }).sort({ createdAt: 'desc' }).populate('customer').lean();
    dashboardData.customers = await Customer.find({ user: req.user._id }).sort({ createdAt: 'asc' }).lean();
    dashboardData.reviews = await Review.find({ user: req.user._id }).sort({ createdAt: 'asc' }).lean();

    res.status(200).json({ status: 200, data: dashboardData });
  } catch (error) {
    console.log('dashboard_get error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};
