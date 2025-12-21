import axiosInstance from './axiosConfig';

export const recipeAPI = {
  // Get recipes with filters
  getRecipes: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        if (Array.isArray(params[key])) {
          params[key].forEach(value => {
            // Ensure value is a string before appending
            const stringValue = String(value || '').trim();
            if (stringValue) {
              queryParams.append(key, stringValue);
            }
          });
        } else {
          // Ensure value is a string before appending
          const stringValue = String(params[key] || '').trim();
          if (stringValue) {
            queryParams.append(key, stringValue);
          }
        }
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `/recipes?${queryString}` : '/recipes';
    
    return axiosInstance.get(url);
  },
  
  // Get single recipe
  getRecipe: (id) => {
    // Ensure id is a string
    const recipeId = String(id || '').trim();
    if (!recipeId) {
      return Promise.reject(new Error('Recipe ID is required'));
    }
    return axiosInstance.get(`/recipes/${recipeId}`);
  },
  
  // Create recipe with image upload
  createRecipe: (recipeData) => {
    const formData = new FormData();
    
    // Append all fields
    Object.keys(recipeData).forEach(key => {
      if (key === 'images' && recipeData.images) {
        recipeData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      } else if (key === 'ingredients' && Array.isArray(recipeData[key])) {
        recipeData[key].forEach(item => {
          formData.append('ingredients', item);
        });
      } else if (key === 'tags' && Array.isArray(recipeData[key])) {
        recipeData[key].forEach(tag => {
          formData.append('tags', tag);
        });
      } else if (recipeData[key] !== undefined && recipeData[key] !== null) {
        formData.append(key, recipeData[key]);
      }
    });
    
    return axiosInstance.post('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update recipe
  updateRecipe: (id, recipeData) => {
    const formData = new FormData();
    
    Object.keys(recipeData).forEach(key => {
      if (key === 'images' && recipeData.images) {
        recipeData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('images', image);
          } else if (typeof image === 'string') {
            // Keep existing images
            formData.append('existingImages', image);
          }
        });
      } else if (key === 'ingredients' && Array.isArray(recipeData[key])) {
        recipeData[key].forEach(item => {
          formData.append('ingredients', item);
        });
      } else if (key === 'tags' && Array.isArray(recipeData[key])) {
        recipeData[key].forEach(tag => {
          formData.append('tags', tag);
        });
      } else if (recipeData[key] !== undefined && recipeData[key] !== null) {
        formData.append(key, recipeData[key]);
      }
    });
    
    return axiosInstance.put(`/recipes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete recipe
  deleteRecipe: (id) => axiosInstance.delete(`/recipes/${id}`),
  
  // Rate recipe
  rateRecipe: (id, ratingData) => axiosInstance.post(`/recipes/${id}/rate`, ratingData),
  
  // Get trending recipes
  getTrendingRecipes: () => axiosInstance.get('/recipes/trending'),
  
  // Get user recipes
  getUserRecipes: (userId) => axiosInstance.get(`/recipes/user/${userId}`),
  
  // Admin: Get all recipes (including unpublished)
  getAllRecipes: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `/recipes/admin/all?${queryString}` : '/recipes/admin/all';
    
    return axiosInstance.get(url);
  },
};