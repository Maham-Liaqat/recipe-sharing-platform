import axiosInstance from './axiosConfig';

export const userAPI = {
  // Get all users (Admin only)
  getUsers: () => axiosInstance.get('/users'),
  
  // Get single user (Admin only)
  getUser: (id) => axiosInstance.get(`/users/${id}`),
  
  // Update user (Admin only)
  updateUser: (id, userData) => axiosInstance.put(`/users/${id}`, userData),
  
  // Delete user (Admin only)
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};

