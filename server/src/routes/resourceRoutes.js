const express = require('express');
const router = express.Router();
const {
  getAllResources,
  getNearbyResources,
  getResourceById,
  getCategories,
  geocodeText
} = require('../controllers/resourceController');

// Categories list
router.get('/categories', getCategories);

// Geocode manual search query
router.get('/geocode', geocodeText);

// Nearby resources by lat/lng
router.get('/nearby', getNearbyResources);

// All resources with filters
router.get('/', getAllResources);

// Single resource by ID
router.get('/:id', getResourceById);

module.exports = router;
