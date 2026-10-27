import api from './api';

export const fetchResources = async (params = {}) => {
  const response = await api.get('/resources', { params });
  return response.data;
};

export const fetchNearbyResources = async ({ latitude, longitude, radius = 25, category, q, limit = 50 }) => {
  const response = await api.get('/resources/nearby', {
    params: { latitude, longitude, radius, category, q, limit }
  });
  return response.data;
};

export const fetchResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/resources/categories');
  return response.data;
};

export const geocodeAddress = async (q) => {
  const response = await api.get('/resources/geocode', { params: { q } });
  return response.data;
};

export const sendFeedback = async (data) => {
  const response = await api.post('/feedback', data);
  return response.data;
};
