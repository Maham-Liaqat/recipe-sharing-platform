import axiosInstance from './axiosConfig';

export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: () => axiosInstance.get('/admin/stats'),
  
  // Get pending recipes
  getPendingRecipes: () => axiosInstance.get('/recipes/admin/pending'),
  
  // Approve recipe
  approveRecipe: (id) => axiosInstance.put(`/recipes/${id}/approve`),
  
  // Reject recipe
  rejectRecipe: (id) => axiosInstance.put(`/recipes/${id}/reject`),
  
  // Update recipe status
  updateRecipeStatus: (id, status) => axiosInstance.put(`/recipes/${id}/status`, { status }),
};

