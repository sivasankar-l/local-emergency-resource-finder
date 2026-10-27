const { CATEGORIES } = require('../models/EmergencyResource');

const validateResourceInput = (req, res, next) => {
  const { name, category, address, city, state, latitude, longitude } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required.');
  }

  if (!category || !CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${CATEGORIES.join(', ')}`);
  }

  if (!address || typeof address !== 'string' || !address.trim()) {
    errors.push('Address is required.');
  }

  if (!city || typeof city !== 'string' || !city.trim()) {
    errors.push('City is required.');
  }

  if (!state || typeof state !== 'string' || !state.trim()) {
    errors.push('State is required.');
  }

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (latitude === undefined || isNaN(lat) || lat < -90 || lat > 90) {
    errors.push('Valid latitude between -90 and 90 is required.');
  }

  if (longitude === undefined || isNaN(lon) || lon < -180 || lon > 180) {
    errors.push('Valid longitude between -180 and 180 is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateFeedbackInput = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    errors.push('Subject is required.');
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Feedback validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateResourceInput,
  validateFeedbackInput
};
