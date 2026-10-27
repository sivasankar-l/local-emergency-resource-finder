import api from './api';

export const adminLogin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const fetchCurrentAdmin = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const adminLogout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const fetchAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const fetchAdminResources = async (params = {}) => {
  const response = await api.get('/admin/resources', { params });
  return response.data;
};

export const createAdminResource = async (resourceData) => {
  const response = await api.post('/admin/resources', resourceData);
  return response.data;
};

export const updateAdminResource = async (id, resourceData) => {
  const response = await api.put(`/admin/resources/${id}`, resourceData);
  return response.data;
};

export const deleteAdminResource = async (id) => {
  const response = await api.delete(`/admin/resources/${id}`);
  return response.data;
};

export const fetchAdminFeedback = async (params = {}) => {
  const response = await api.get('/admin/feedback', { params });
  return response.data;
};

export const updateFeedbackStatus = async (id, status) => {
  const response = await api.patch(`/admin/feedback/${id}`, { status });
  return response.data;
};
