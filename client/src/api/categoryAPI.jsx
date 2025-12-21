import axiosInstance from './axiosConfig';

export const categoryAPI = {
  getCategories: () => axiosInstance.get('/categories'),
  createCategory: (categoryData) => axiosInstance.post('/categories', categoryData),
  updateCategory: (id, categoryData) => axiosInstance.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),
};