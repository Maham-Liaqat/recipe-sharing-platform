const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalRecipes,
      totalUsers,
      pendingRecipes,
      totalCategories,
      publishedRecipes,
      draftRecipes,
      rejectedRecipes,
      recentRecipes,
      topRatedRecipes
    ] = await Promise.all([
      Recipe.countDocuments(),
      User.countDocuments(),
      Recipe.countDocuments({ status: 'pending' }),
      Category.countDocuments({ isActive: true }),
      Recipe.countDocuments({ status: 'published' }),
      Recipe.countDocuments({ status: 'draft' }),
      Recipe.countDocuments({ status: 'rejected' }),
      Recipe.find()
        .populate('author', 'name avatar')
        .sort('-createdAt')
        .limit(5),
      Recipe.find({ status: 'published' })
        .sort('-averageRating -ratingCount')
        .limit(5)
        .populate('author', 'name avatar')
    ]);

    // Calculate average rating
    const allPublishedRecipes = await Recipe.find({ status: 'published' });
    const avgRating = allPublishedRecipes.length > 0
      ? allPublishedRecipes.reduce((sum, recipe) => sum + (recipe.averageRating || 0), 0) / allPublishedRecipes.length
      : 0;

    // Get recipes by month for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recipesByMonth = await Recipe.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = recipesByMonth.map(item => ({
      name: monthNames[item._id.month - 1],
      recipes: item.count
    }));

    res.status(200).json({
      success: true,
      data: {
        totalRecipes,
        totalUsers,
        pendingRecipes,
        totalCategories,
        publishedRecipes,
        draftRecipes,
        rejectedRecipes,
        avgRating: avgRating.toFixed(1),
        recentRecipes,
        topRatedRecipes,
        chartData
      }
    });
  } catch (error) {
    next(error);
  }
};

