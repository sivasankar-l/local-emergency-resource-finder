const { EmergencyResource, CATEGORIES } = require('../models/EmergencyResource');
const { calculateHaversineDistance } = require('../utils/geoUtils');
const { findNearbyResources } = require('../services/resourceDiscoveryService');
const { geocodeLocation } = require('../services/geocodingService');

// @desc    Get all resources with filters and pagination
// @route   GET /api/resources
exports.getAllResources = async (req, res, next) => {
  try {
    const { category, q, latitude, longitude, radius, sort, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: regex },
        { address: regex },
        { city: regex },
        { state: regex },
        { services: regex }
      ];
    }

    let resources = await EmergencyResource.find(query).lean();

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const hasUserLoc = !isNaN(userLat) && !isNaN(userLon);

    // Calculate distance
    resources = resources.map((item) => {
      let distance = null;
      if (hasUserLoc && item.latitude && item.longitude) {
        distance = calculateHaversineDistance(userLat, userLon, item.latitude, item.longitude);
      }
      return { ...item, distance };
    });

    // Filter by radius if user provided coordinates and radius
    if (hasUserLoc && radius) {
      const radKm = parseFloat(radius);
      if (!isNaN(radKm) && radKm > 0) {
        resources = resources.filter((item) => item.distance !== null && item.distance <= radKm);
      }
    }

    // Sorting
    if (sort === 'nearest' && hasUserLoc) {
      resources.sort((a, b) => (a.distance ?? 999999) - (b.distance ?? 999999));
    } else if (sort === 'name') {
      resources.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default newest
      resources.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    const total = resources.length;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = resources.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: paginated.length,
      data: paginated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby resources sorted by distance
// @route   GET /api/resources/nearby
exports.getNearbyResources = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 25, category, q, limit = 50 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Both latitude and longitude are required to calculate nearby resources.'
      });
    }

    const result = await findNearbyResources({
      latitude,
      longitude,
      radius,
      category,
      q,
      limit
    });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resource by ID
// @route   GET /api/resources/:id
exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await EmergencyResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found with the requested ID.'
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories and counts
// @route   GET /api/resources/categories
exports.getCategories = async (req, res, next) => {
  try {
    const counts = await EmergencyResource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const categoriesWithCount = CATEGORIES.map((cat) => ({
      name: cat,
      count: countMap[cat] || 0
    }));

    res.status(200).json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Geocode manual location text query
// @route   GET /api/resources/geocode
exports.geocodeText = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter q is required for geocoding'
      });
    }

    const geoResult = await geocodeLocation(q);
    res.status(200).json({
      success: true,
      data: geoResult
    });
  } catch (error) {
    next(error);
  }
};
