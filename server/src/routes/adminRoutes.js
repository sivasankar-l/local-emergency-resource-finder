const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/authMiddleware');
const { validateResourceInput } = require('../middleware/validationMiddleware');
const {
  getDashboardStats,
  getAllAdminResources,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/adminController');
const {
  getAllFeedback,
  updateFeedbackStatus
} = require('../controllers/feedbackController');

// Protect all admin routes
router.use(protectAdmin);

// Admin stats
router.get('/stats', getDashboardStats);

// Resource management
router.get('/resources', getAllAdminResources);
router.post('/resources', validateResourceInput, createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

// Feedback management
router.get('/feedback', getAllFeedback);
router.patch('/feedback/:id', updateFeedbackStatus);

module.exports = router;
