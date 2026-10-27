const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controllers/feedbackController');
const { validateFeedbackInput } = require('../middleware/validationMiddleware');

router.post('/', validateFeedbackInput, submitFeedback);

module.exports = router;
