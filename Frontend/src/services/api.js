import axios from 'axios';
import router from '../router';
import { useToastStore } from '../stores/toastStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
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
  (response) => response,
  (error) => {
    // Network error (no response at all — offline or server unreachable)
    if (!error.response) {
      const toast = useToastStore();
      toast.show('Network error — please check your connection.', 'warning');
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      localStorage.removeItem('auth_token');
      router.push('/login');
    } else if (status >= 500) {
      const toast = useToastStore();
      toast.show('Something went wrong on our end. Please try again.', 'error');
    }

    return Promise.reject(error);
  }
);

export default api;
