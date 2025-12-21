import axiosInstance from './axiosConfig';

export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
  updateProfile: (userData) => axiosInstance.put('/auth/profile', userData),
};