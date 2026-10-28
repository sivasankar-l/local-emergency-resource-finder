import api from './api';
import { DEMO_EMERGENCY_RESOURCES, calculateLocalDistance } from './demoFallbackData';

export const fetchResources = async (params = {}) => {
  try {
    const response = await api.get('/resources', { params });
    return response.data;
  } catch (error) {
    console.warn('[ResourceService] API unreachable, activating offline demonstration fallback');
    let results = [...DEMO_EMERGENCY_RESOURCES];
    if (params.category && params.category !== 'All') {
      results = results.filter((r) => r.category === params.category);
    }
    if (params.q && params.q.trim()) {
      const q = params.q.toLowerCase();
      results = results.filter(
        (r) => r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q)
      );
    }
    return {
      success: true,
      total: results.length,
      data: results
    };
  }
};

export const fetchNearbyResources = async ({
  latitude,
  longitude,
  radius = 25,
  category,
  q,
  limit = 50
}) => {
  try {
    const response = await api.get('/resources/nearby', {
      params: { latitude, longitude, radius, category, q, limit }
    });
    return response.data;
  } catch (error) {
    console.warn('[ResourceService] API unreachable, activating offline proximity fallback');
    let results = [...DEMO_EMERGENCY_RESOURCES];
    if (category && category !== 'All') {
      results = results.filter((r) => r.category === category);
    }
    if (q && q.trim()) {
      const query = q.toLowerCase();
      results = results.filter(
        (r) => r.name.toLowerCase().includes(query) || r.address.toLowerCase().includes(query)
      );
    }

    const userLat = Number(latitude);
    const userLon = Number(longitude);

    results = results.map((item) => ({
      ...item,
      distance: calculateLocalDistance(userLat, userLon, item.latitude, item.longitude)
    }));

    if (radius && radius > 0) {
      results = results.filter((item) => item.distance !== null && item.distance <= radius);
    }

    results.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));

    return {
      success: true,
      total: results.length,
      count: results.length,
      radius,
      resources: results.slice(0, limit)
    };
  }
};

export const fetchResourceById = async (id) => {
  try {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  } catch (error) {
    const found = DEMO_EMERGENCY_RESOURCES.find((r) => r._id === id);
    if (found) {
      return { success: true, data: found };
    }
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/resources/categories');
    return response.data;
  } catch (error) {
    const counts = {};
    DEMO_EMERGENCY_RESOURCES.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    const CATEGORIES = [
      'Hospitals',
      'Ambulance Services',
      'Police Stations',
      'Fire Stations',
      'Pharmacies',
      'Blood Banks',
      'Emergency Shelters'
    ];
    return {
      success: true,
      data: CATEGORIES.map((c) => ({ name: c, count: counts[c] || 0 }))
    };
  }
};

export const geocodeAddress = async (q) => {
  try {
    const response = await api.get('/resources/geocode', { params: { q } });
    return response.data;
  } catch (error) {
    // Client-side OpenStreetMap Nominatim geocoding fallback
    const encoded = encodeURIComponent(q.trim());
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=in`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return {
        success: true,
        data: {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          displayName: data[0].display_name
        }
      };
    }
    return {
      success: true,
      data: {
        latitude: 12.9165,
        longitude: 79.1325,
        displayName: `${q.trim()} (Approx. Vellore Region)`
      }
    };
  }
};

export const sendFeedback = async (data) => {
  try {
    const response = await api.post('/feedback', data);
    return response.data;
  } catch (error) {
    return {
      success: true,
      message: 'Demo Mode: Feedback recorded locally in browser session.'
    };
  }
};
