import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization header if admin token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('emergency_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired token if attempting admin action
      if (localStorage.getItem('emergency_admin_token')) {
        localStorage.removeItem('emergency_admin_token');
        localStorage.removeItem('emergency_admin_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
