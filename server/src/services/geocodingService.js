const https = require('https');

// Local fallback dictionary for common regions / landmarks in Vellore & Tamil Nadu
const LOCAL_GEOCODE_CACHE = {
  'vellore': { lat: 12.9165, lon: 79.1325, displayName: 'Vellore, Tamil Nadu, India' },
  'vit': { lat: 12.9698, lon: 79.1559, displayName: 'Vellore Institute of Technology (VIT), Katpadi, Vellore, Tamil Nadu' },
  'vit vellore': { lat: 12.9698, lon: 79.1559, displayName: 'Vellore Institute of Technology (VIT), Katpadi, Vellore, Tamil Nadu' },
  'katpadi': { lat: 12.9774, lon: 79.1396, displayName: 'Katpadi, Vellore, Tamil Nadu, India' },
  'cmc': { lat: 12.9238, lon: 79.1332, displayName: 'Christian Medical College (CMC), Vellore, Tamil Nadu' },
  'cmc vellore': { lat: 12.9238, lon: 79.1332, displayName: 'Christian Medical College (CMC), Vellore, Tamil Nadu' },
  'bagayam': { lat: 12.8712, lon: 79.1368, displayName: 'Bagayam, Vellore, Tamil Nadu, India' },
  'sathuvachari': { lat: 12.9362, lon: 79.1678, displayName: 'Sathuvachari, Vellore, Tamil Nadu, India' },
  'ranipet': { lat: 12.9298, lon: 79.3328, displayName: 'Ranipet, Tamil Nadu, India' },
  'arcot': { lat: 12.9038, lon: 79.3339, displayName: 'Arcot, Tamil Nadu, India' },
  'chennai': { lat: 13.0827, lon: 80.2707, displayName: 'Chennai, Tamil Nadu, India' }
};

/**
 * Geocode an address/location query using OpenStreetMap Nominatim with in-memory caching
 * and local landmark fallback.
 */
async function geocodeLocation(query) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    throw new Error('Query string is required for geocoding');
  }

  const normalized = query.trim().toLowerCase();

  // Check known landmark matches
  for (const [key, val] of Object.entries(LOCAL_GEOCODE_CACHE)) {
    if (normalized === key || normalized.includes(key)) {
      return {
        latitude: val.lat,
        longitude: val.lon,
        displayName: val.displayName,
        source: 'cached-landmark'
      };
    }
  }

  // Use OpenStreetMap Nominatim with respectful headers
  return new Promise((resolve) => {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&countrycodes=in`;

    const options = {
      headers: {
        'User-Agent': 'LocalEmergencyResourceFinder-VIT-IIP/1.0 (academic.project@vit.ac.in)',
        'Accept': 'application/json'
      },
      timeout: 4000
    };

    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const results = JSON.parse(data);
            if (Array.isArray(results) && results.length > 0) {
              const top = results[0];
              const resultObj = {
                latitude: parseFloat(top.lat),
                longitude: parseFloat(top.lon),
                displayName: top.display_name,
                source: 'openstreetmap-nominatim'
              };
              // Cache for future requests
              LOCAL_GEOCODE_CACHE[normalized] = {
                lat: resultObj.latitude,
                lon: resultObj.longitude,
                displayName: resultObj.displayName
              };
              return resolve(resultObj);
            }
          }
          // If no result found from Nominatim, fallback to Vellore default center
          resolve({
            latitude: 12.9165,
            longitude: 79.1325,
            displayName: `${query.trim()} (Approx. Vellore Region)`,
            source: 'default-fallback'
          });
        } catch (e) {
          resolve({
            latitude: 12.9165,
            longitude: 79.1325,
            displayName: `${query.trim()} (Approx. Vellore Region)`,
            source: 'default-fallback'
          });
        }
      });
    });

    req.on('error', () => {
      resolve({
        latitude: 12.9165,
        longitude: 79.1325,
        displayName: `${query.trim()} (Approx. Vellore Region)`,
        source: 'default-fallback'
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        latitude: 12.9165,
        longitude: 79.1325,
        displayName: `${query.trim()} (Approx. Vellore Region)`,
        source: 'default-fallback'
      });
    });
  });
}

module.exports = {
  geocodeLocation,
  LOCAL_GEOCODE_CACHE
};
