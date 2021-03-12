const Template = require('../models/Template');
const validator = require('validator');

module.exports.templates_get = async (req, res) => {
  try {
    // Process
    const data = await Template.find({ user: req.user._id });

    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.log('templates_get error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.templates_post = async (req, res) => {
  try {
    // Fetch Data from Request
    const name = req.body.name ? req.body.name.trim() : '';
    const body = req.body.body ? req.body.body.trim() : '';

    // Validators
    const errors = [];
    if (validator.isEmpty(name) || validator.isEmpty(body)) {
      errors.push('name and body is required');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors.join('\n') });
    }

    // Process
    const newTemplate = new Template({
      user: req.user._id,
      body,
      name,
    });
    await newTemplate.save();

    await res.status(200).json({ status: 200, data: newTemplate });
  } catch (error) {
    console.log('templates_post error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.templates_delete = async (req, res) => {
  try {
    // Fetch Data from Request
    const { id } = req.params;

    // Validators
    await Template.findByIdAndDelete(id);

    await res.status(200).json({ status: 200, data: 'deleted' });
  } catch (error) {
    console.log('templates_post error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};

module.exports.templates_select_get = async (req, res) => {
  try {
    // Fetch Data from Request
    const { id } = req.params;

    await Template.updateMany({ user: req.user._id }, { selected: false });

    await Template.findByIdAndUpdate(id, { selected: true });

    res.status(200).json({ status: 200, data: 'selected' });
  } catch (error) {
    console.log('templates_select_get error', error.stack);
    res.status(500).json({ status: 500, data: 'Server Error' });
  }
};
