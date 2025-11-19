import axios from 'axios';

// Set base URL from environment variable or default to localhost
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
