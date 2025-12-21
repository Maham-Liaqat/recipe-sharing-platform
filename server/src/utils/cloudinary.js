// const express = require('express');
// const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');
// const {
//   getRecipes,
//   getRecipe,
//   createRecipe,
//   updateRecipe,
//   deleteRecipe,
//   rateRecipe,
//   getUserRecipes,
//   getTrendingRecipes,
//   getPendingRecipes,
//   approveRecipe,
//   rejectRecipe,
//   updateRecipeStatus
// } = require('../controllers/recipeController');

// // Public routes
// router.get('/', getRecipes);
// router.get('/trending', getTrendingRecipes);
// router.get('/user/:userId', getUserRecipes);
// router.get('/:id', getRecipe);

// // Protected routes
// router.post('/', protect, createRecipe);
// router.put('/:id', protect, updateRecipe);
// router.delete('/:id', protect, deleteRecipe);
// router.post('/:id/rate', protect, rateRecipe);

// // Admin routes
// router.get('/admin/pending', protect, authorize('admin'), getPendingRecipes);
// router.put('/:id/approve', protect, authorize('admin'), approveRecipe);
// router.put('/:id/reject', protect, authorize('admin'), rejectRecipe);
// router.put('/:id/status', protect, authorize('admin'), updateRecipeStatus);

// module.exports = router;