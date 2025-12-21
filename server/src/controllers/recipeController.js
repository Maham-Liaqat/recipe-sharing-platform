const Recipe = require('../models/Recipe');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2; // Import cloudinary directly

// Cloudinary utility functions
const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Extract public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/cloudname/image/upload/v1234567/folder/image.jpg
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    const pathAfterUpload = parts.slice(uploadIndex + 1).join('/');
    const publicId = pathAfterUpload.split('.')[0]; // Remove file extension
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || !process.env.CLOUDINARY_CLOUD_NAME) {
    console.log('Cloudinary not configured, skipping image deletion');
    return true;
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deleted from Cloudinary:', publicId, result.result);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
    return true; // Don't fail recipe deletion if Cloudinary fails
  }
};

// Optional: Server-side image upload (if needed)
const uploadToCloudinary = async (imageData, folder = 'recipes') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary not configured');
  }
  
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image: ' + error.message);
  }
};

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res, next) => {
  try {
    // Filtering, sorting, pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Build query
    let query = {};
    if (req.user?.role !== 'admin') {
      query.status = 'published';
    }
    
    // Allow status filter for admin
    if (req.query.status && req.user?.role === 'admin') {
      query.status = req.query.status;
    }
    
    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Filters
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.cuisine) {
      query.cuisine = req.query.cuisine;
    }
    
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }
    
    if (req.query.author) {
      query.author = req.query.author;
    }
    
    // Prep time filter
    if (req.query.maxTime) {
      query.prepTime = { $lte: parseInt(req.query.maxTime) };
    }
    
    // Sorting
    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',');
      sortBy.forEach(item => {
        const [key, order] = item.split(':');
        sort[key] = order === 'desc' ? -1 : 1;
      });
    } else {
      sort = { createdAt: -1 };
    }
    
    // Execute query
    const recipes = await Recipe.find(query)
      .populate('author', 'name avatar')
      .sort(sort)
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Recipe.countDocuments(query);
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      },
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate('ratings.user', 'name avatar');
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    // Increment view count
    recipe.views += 1;
    await recipe.save();
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Add author to req.body
    req.body.author = req.user.id;
    
    // Handle images - Cloudinary URLs from frontend
    // Frontend should upload to Cloudinary and send URLs
    if (req.body.images && req.body.images.length > 0) {
      // Validate Cloudinary URLs
      const validImages = req.body.images.filter(img => 
        typeof img === 'string' && img.length > 0
      );
      
      if (validImages.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid image URLs provided'
        });
      }
      
      req.body.images = validImages;
    }
    
    const recipe = await Recipe.create(req.body);
    
    res.status(201).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
exports.updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    // Make sure user is recipe owner or admin
    if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }
    
    // Handle images - Cloudinary URLs from frontend
    if (req.body.images && req.body.images.length > 0) {
      // Optionally delete old images from Cloudinary
      if (recipe.images && recipe.images.length > 0) {
        for (const oldImage of recipe.images) {
          const publicId = extractPublicId(oldImage);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        }
      }
      
      req.body.images = req.body.images;
    }
    
    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    // Make sure user is recipe owner or admin
    if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
    }
    
    // Delete images from Cloudinary if configured
    if (recipe.images && recipe.images.length > 0) {
      console.log('Deleting recipe images from Cloudinary...');
      
      for (const imageUrl of recipe.images) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
    }
    
    await recipe.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
// @access  Private
exports.rateRecipe = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    // Check if user already rated
    const alreadyRated = recipe.ratings.find(
      r => r.user.toString() === req.user.id.toString()
    );
    
    if (alreadyRated) {
      // Update existing rating
      recipe.ratings.forEach(item => {
        if (item.user.toString() === req.user.id.toString()) {
          item.rating = rating;
          item.review = review || item.review;
          item.updatedAt = new Date();
        }
      });
    } else {
      // Add new rating
      recipe.ratings.push({
        user: req.user.id,
        rating,
        review: review || '',
        createdAt: new Date()
      });
    }
    
    // Update average rating
    const totalRatings = recipe.ratings.length;
    const sumRatings = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    recipe.averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;
    
    await recipe.save();
    
    res.status(200).json({
      success: true,
      message: alreadyRated ? 'Rating updated' : 'Rating added',
      data: {
        averageRating: recipe.averageRating,
        totalRatings: recipe.ratings.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's recipes
// @route   GET /api/recipes/user/:userId
// @access  Public
exports.getUserRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ 
      author: req.params.userId,
      status: 'published'
    }).populate('author', 'name avatar');
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending recipes
// @route   GET /api/recipes/trending
// @access  Public
exports.getTrendingRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ status: 'published' })
      .sort({ views: -1, averageRating: -1, createdAt: -1 })
      .limit(10)
      .populate('author', 'name avatar');
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending recipes (Admin only)
// @route   GET /api/recipes/admin/pending
// @access  Private/Admin
exports.getPendingRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ status: 'pending' })
      .populate('author', 'name avatar email')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve recipe (Admin only)
// @route   PUT /api/recipes/:id/approve
// @access  Private/Admin
exports.approveRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    recipe.status = 'published';
    recipe.publishedAt = new Date();
    await recipe.save();
    
    res.status(200).json({
      success: true,
      message: 'Recipe approved successfully',
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject recipe (Admin only)
// @route   PUT /api/recipes/:id/reject
// @access  Private/Admin
exports.rejectRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    recipe.status = 'rejected';
    recipe.rejectionReason = req.body.reason || 'Not specified';
    await recipe.save();
    
    res.status(200).json({
      success: true,
      message: 'Recipe rejected successfully',
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recipe status (Admin only)
// @route   PUT /api/recipes/:id/status
// @access  Private/Admin
exports.updateRecipeStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    
    if (!['draft', 'pending', 'published', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: draft, pending, published, rejected'
      });
    }
    
    const updateData = { status };
    
    // Add timestamp for published/rejected status
    if (status === 'published') {
      updateData.publishedAt = new Date();
    } else if (status === 'rejected') {
      updateData.rejectionReason = reason || 'Not specified';
    }
    
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Recipe status updated to ${status}`,
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload image to Cloudinary (server-side)
// @route   POST /api/recipes/upload-image
// @access  Private
exports.uploadRecipeImage = async (req, res, next) => {
  try {
    const { image, folder = 'recipes' } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided'
      });
    }
    
    const result = await uploadToCloudinary(image, folder);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

// Export utility functions if needed elsewhere
exports.extractPublicId = extractPublicId;
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.uploadToCloudinary = uploadToCloudinary;