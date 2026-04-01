import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Check localStorage for auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If a request returns a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Clear token
      localStorage.removeItem('auth_token');
      // Force redirect to login
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
