const { EmergencyResource } = require('../models/EmergencyResource');
const { calculateHaversineDistance } = require('../utils/geoUtils');

/**
 * Find nearby emergency resources with proximity calculation, category filter, radius filter and pagination
 */
async function findNearbyResources({ latitude, longitude, radius = 25, category, q, limit = 50 }) {
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
      { description: regex },
      { services: regex }
    ];
  }

  // Fetch candidate resources
  const resources = await EmergencyResource.find(query).lean();

  const userLat = Number(latitude);
  const userLon = Number(longitude);
  const radiusKm = Number(radius);

  // If user coordinates provided, calculate distance and filter by radius
  let results = resources.map((item) => {
    let distance = null;
    if (!isNaN(userLat) && !isNaN(userLon) && item.latitude && item.longitude) {
      distance = calculateHaversineDistance(userLat, userLon, item.latitude, item.longitude);
    }
    return {
      ...item,
      distance
    };
  });

  if (!isNaN(userLat) && !isNaN(userLon)) {
    // Filter by radius if specified
    if (radiusKm > 0) {
      results = results.filter((item) => item.distance !== null && item.distance <= radiusKm);
    }

    // Sort by nearest distance first
    results.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  } else {
    // Sort by newest
    results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  const limitedResults = results.slice(0, Number(limit) || 50);

  return {
    total: results.length,
    count: limitedResults.length,
    radius: radiusKm,
    userLocation: (!isNaN(userLat) && !isNaN(userLon)) ? { latitude: userLat, longitude: userLon } : null,
    resources: limitedResults
  };
}

module.exports = {
  findNearbyResources
};
