import axios from 'axios';

// Ensure API_BASE_URL is always a string
const getApiBaseUrl = () => {
  const url = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  // Ensure it's a string and remove trailing slashes
  const cleanUrl = String(url).trim().replace(/\/+$/, '');
  // Ensure it ends with /api
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL in development to help debug
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL);
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  // Ensure response is treated as JSON
  responseType: 'json',
  // Transform response to handle non-JSON responses
  transformResponse: [
    function (data) {
      // If data is already an object, return it
      if (typeof data === 'object') {
        return data;
      }
      // If data is a string, try to parse it
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch (e) {
          // If parsing fails, return the string wrapped in an object
          return { message: data };
        }
      }
      return data;
    }
  ],
});

// Request interceptor to add token and validate URLs
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure baseURL is a string
    if (config.baseURL && typeof config.baseURL !== 'string') {
      config.baseURL = String(config.baseURL);
    }
    
    // Ensure url is a string
    if (config.url && typeof config.url !== 'string') {
      config.url = String(config.url);
    }
    
    // Ensure headers are objects
    if (!config.headers || typeof config.headers !== 'object') {
      config.headers = {};
    }
    
    const token = localStorage.getItem('recipeToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear local storage and redirect to login
      localStorage.removeItem('recipeToken');
      localStorage.removeItem('recipeUser');
      window.location.href = '/login';
    }
    
    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('Network Error:', error);
      console.error('Request URL:', originalRequest?.url);
      console.error('Base URL:', API_BASE_URL);
      
      // Check if API URL is not configured
      if (typeof API_BASE_URL === 'string' && API_BASE_URL.includes('localhost') && process.env.NODE_ENV === 'production') {
        console.error('⚠️ API URL is not configured! Set REACT_APP_API_URL environment variable in Vercel.');
      }
      
      return Promise.reject({
        message: 'Network error. Please check your internet connection and API configuration.',
        isNetworkError: true,
        apiUrl: API_BASE_URL
      });
    }
    
    // Handle non-JSON responses (like HTML error pages)
    let errorMessage = 'An error occurred';
    let errorData = error.response.data;
    
    if (typeof errorData === 'string') {
      // If response is HTML or plain text, extract meaningful message
      if (errorData.includes && (errorData.includes('<!DOCTYPE') || errorData.includes('<html'))) {
        errorMessage = `Server returned HTML instead of JSON. Status: ${error.response.status}`;
      } else {
        errorMessage = errorData;
      }
    } else if (errorData && typeof errorData === 'object') {
      errorMessage = errorData.message || errorData.error || 'An error occurred';
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: errorData
    });
  }
);

export default axiosInstance;