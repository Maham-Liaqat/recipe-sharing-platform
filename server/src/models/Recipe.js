const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a recipe title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: {
    type: String,
    required: [true, 'Please add instructions']
  },
  prepTime: {
    type: Number,
    required: [true, 'Please add preparation time'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Please select difficulty level']
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  cuisine: {
    type: String,
    required: [true, 'Please select a cuisine']
  },
  servings: {
    type: Number,
    required: [true, 'Please add number of servings'],
    min: [1, 'Servings must be at least 1']
  },
  images: [{
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
  }],
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected'],
    default: 'published'
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  favoritesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update average rating when ratings change
recipeSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = total / this.ratings.length;
    this.ratingCount = this.ratings.length;
  }
  next();
});

// Update updatedAt on save
recipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for search
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);