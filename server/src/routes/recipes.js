const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');

// Validation rules
const recipeValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('ingredients', 'Ingredients are required').isArray({ min: 1 }),
  check('instructions', 'Instructions are required').not().isEmpty(),
  check('prepTime', 'Preparation time is required').isInt({ min: 1 }),
  check('difficulty', 'Difficulty is required').isIn(['easy', 'medium', 'hard']),
  check('category', 'Category is required').not().isEmpty(),
  check('cuisine', 'Cuisine is required').not().isEmpty(),
  check('servings', 'Servings are required').isInt({ min: 1 })
];

// Public routes
router.get('/', recipeController.getRecipes);
router.get('/trending', recipeController.getTrendingRecipes);
router.get('/user/:userId', recipeController.getUserRecipes);
router.get('/:id', recipeController.getRecipe);

// Protected routes
router.post(
  '/',
  protect,
  uploadImages,
  recipeValidation,
  recipeController.createRecipe
);

router.put(
  '/:id',
  protect,
  uploadImages,
  recipeController.updateRecipe
);

router.delete('/:id', protect, recipeController.deleteRecipe);
router.post('/:id/rate', protect, recipeController.rateRecipe);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), recipeController.getRecipes);
router.get('/admin/pending', protect, authorize('admin'), recipeController.getPendingRecipes);
router.put('/:id/approve', protect, authorize('admin'), recipeController.approveRecipe);
router.put('/:id/reject', protect, authorize('admin'), recipeController.rejectRecipe);
router.put('/:id/status', protect, authorize('admin'), recipeController.updateRecipeStatus);

module.exports = router;