require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const bcrypt = require('bcryptjs');

// Enhanced sample data
const categories = [
  { 
    name: 'Main Course', 
    description: 'Hearty and satisfying main dishes', 
    icon: '🍛', 
    color: '#FF6B6B' 
  },
  { 
    name: 'Dessert', 
    description: 'Sweet treats and delightful desserts', 
    icon: '🍰', 
    color: '#9C27B0' 
  },
  { 
    name: 'Appetizer', 
    description: 'Starters and snacks to begin your meal', 
    icon: '🥗', 
    color: '#4CAF50' 
  },
  { 
    name: 'Breakfast', 
    description: 'Morning meals to start your day right', 
    icon: '🍳', 
    color: '#FF9800' 
  },
  { 
    name: 'Snack', 
    description: 'Quick bites and light snacks', 
    icon: '🍕', 
    color: '#2196F3' 
  },
  { 
    name: 'Drink', 
    description: 'Beverages, cocktails, and refreshments', 
    icon: '🍹', 
    color: '#00BCD4' 
  },
  { 
    name: 'Vegetarian', 
    description: 'Plant-based and vegetarian recipes', 
    icon: '🥦', 
    color: '#4CAF50' 
  },
  { 
    name: 'Healthy', 
    description: 'Nutritious and health-focused meals', 
    icon: '🥑', 
    color: '#8BC34A' 
  }
];

const users = [
  {
    name: 'Admin Chef',
    email: 'admin@recipe.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/300?img=1',
    bio: 'Head chef and administrator of RecipeShare'
  },
  {
    name: 'John MasterChef',
    email: 'john@recipe.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/300?img=5',
    bio: 'Passionate home cook sharing family recipes'
  },
  {
    name: 'Sarah Baker',
    email: 'sarah@recipe.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/300?img=3',
    bio: 'Baking enthusiast and dessert specialist'
  },
  {
    name: 'Mike HealthyEats',
    email: 'mike@recipe.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/300?img=7',
    bio: 'Fitness enthusiast sharing healthy recipes'
  }
];

const recipes = [
  {
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish with creamy eggs, cheese, and crispy pancetta',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale, diced',
      '4 large eggs',
      '100g Pecorino Romano cheese, grated',
      '50g Parmesan cheese, grated',
      'Freshly ground black pepper',
      'Salt to taste',
      '2 cloves garlic, minced'
    ],
    instructions: `
      <h3>Step 1: Prepare Ingredients</h3>
      <p>Bring a large pot of salted water to boil for the pasta.</p>
      
      <h3>Step 2: Cook Pancetta</h3>
      <p>In a large pan, cook the pancetta over medium heat until crispy. Add garlic in the last minute of cooking.</p>
      
      <h3>Step 3: Mix Eggs and Cheese</h3>
      <p>In a bowl, whisk together eggs, grated cheeses, and plenty of black pepper.</p>
      
      <h3>Step 4: Cook Pasta</h3>
      <p>Cook spaghetti according to package instructions until al dente. Reserve 1 cup of pasta water before draining.</p>
      
      <h3>Step 5: Combine</h3>
      <p>Quickly mix hot pasta with pancetta, then remove from heat and stir in egg mixture. Add pasta water as needed for creaminess.</p>
      
      <h3>Step 6: Serve</h3>
      <p>Serve immediately with extra cheese and black pepper.</p>
    `,
    prepTime: 25,
    difficulty: 'easy',
    category: 'Main Course',
    cuisine: 'Italian',
    servings: 4,
    tags: ['pasta', 'italian', 'quick', 'dinner'],
    images: ['https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800&auto=format&fit=crop']
  },
  {
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with a molten chocolate center',
    ingredients: [
      '200g dark chocolate (70% cocoa)',
      '100g unsalted butter',
      '3 large eggs',
      '100g granulated sugar',
      '50g all-purpose flour',
      'Pinch of salt',
      '1 tsp vanilla extract',
      'Butter for ramekins',
      'Cocoa powder for dusting'
    ],
    instructions: `
      <h3>Step 1: Prepare Ramekins</h3>
      <p>Butter 4 ramekins and dust with cocoa powder. Preheat oven to 220°C (425°F).</p>
      
      <h3>Step 2: Melt Chocolate and Butter</h3>
      <p>In a double boiler, melt chocolate and butter together until smooth. Remove from heat and let cool slightly.</p>
      
      <h3>Step 3: Mix Eggs and Sugar</h3>
      <p>In a separate bowl, whisk eggs and sugar until pale and fluffy, about 3-4 minutes.</p>
      
      <h3>Step 4: Combine</h3>
      <p>Gently fold melted chocolate into egg mixture. Sift in flour and salt, then fold until just combined.</p>
      
      <h3>Step 5: Bake</h3>
      <p>Divide batter among ramekins. Bake for 12-14 minutes until edges are set but center is still soft.</p>
      
      <h3>Step 6: Serve</h3>
      <p>Let rest for 1 minute, then invert onto plates. Serve immediately with ice cream or berries.</p>
    `,
    prepTime: 30,
    difficulty: 'medium',
    category: 'Dessert',
    cuisine: 'French',
    servings: 4,
    tags: ['chocolate', 'dessert', 'baking', 'romantic'],
    images: ['https://images.unsplash.com/photo-1624353365286-3f8d62dadadf?w-800&auto=format&fit=crop']
  },
  {
    title: 'Avocado Toast with Poached Eggs',
    description: 'Healthy breakfast with creamy avocado and perfectly poached eggs',
    ingredients: [
      '2 slices sourdough bread',
      '1 ripe avocado',
      '2 large eggs',
      '1 tbsp lemon juice',
      'Red pepper flakes',
      'Salt and pepper to taste',
      'Fresh cilantro or parsley',
      '1 tsp white vinegar (for poaching)'
    ],
    instructions: `
      <h3>Step 1: Toast Bread</h3>
      <p>Toast sourdough bread until golden and crispy.</p>
      
      <h3>Step 2: Prepare Avocado</h3>
      <p>Mash avocado with lemon juice, salt, and pepper until creamy but still slightly chunky.</p>
      
      <h3>Step 3: Poach Eggs</h3>
      <p>Bring water to simmer in a saucepan. Add vinegar. Create a whirlpool and gently slide in eggs. Cook for 3-4 minutes.</p>
      
      <h3>Step 4: Assemble</h3>
      <p>Spread avocado mixture on toast. Top with poached eggs.</p>
      
      <h3>Step 5: Season</h3>
      <p>Sprinkle with red pepper flakes, fresh herbs, and extra pepper.</p>
    `,
    prepTime: 15,
    difficulty: 'easy',
    category: 'Breakfast',
    cuisine: 'American',
    servings: 1,
    tags: ['healthy', 'breakfast', 'quick', 'vegetarian'],
    images: ['https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop']
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_LOCAL || 'mongodb://localhost:27017/recipe-sharing';
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in .env file');
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Recipe.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Hash passwords
    console.log('🔐 Hashing passwords...');
    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    
    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Create categories
    console.log('🏷️ Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    // Create recipes
    console.log('🍳 Creating recipes...');
    const recipePromises = recipes.map(async (recipe, index) => {
      recipe.author = createdUsers[index % createdUsers.length]._id;
      // Add some ratings
      recipe.ratings = [
        {
          user: createdUsers[(index + 1) % createdUsers.length]._id,
          rating: 4.5,
          review: 'Delicious recipe! Will make again.'
        },
        {
          user: createdUsers[(index + 2) % createdUsers.length]._id,
          rating: 5,
          review: 'Perfect instructions, came out great!'
        }
      ];
      return Recipe.create(recipe);
    });
    
    const createdRecipes = await Promise.all(recipePromises);
    console.log(`✅ Created ${createdRecipes.length} recipes`);
    
    // Update categories with recipe counts
    console.log('📊 Updating category counts...');
    for (let category of createdCategories) {
      const count = await Recipe.countDocuments({ category: category.name });
      await Category.findByIdAndUpdate(category._id, { recipeCount: count });
    }
    
    // Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('='.repeat(50));
    console.log('📊 SEEDING SUMMARY:');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`🏷️ Categories: ${createdCategories.length}`);
    console.log(`🍳 Recipes: ${createdRecipes.length}`);
    console.log('='.repeat(50));
    console.log('\n🔗 Sample API Endpoints:');
    console.log(`🌐 API Base: http://localhost:${process.env.PORT || 5000}`);
    console.log('📚 Get all recipes: GET /api/recipes');
    console.log('🔐 Login with: email: admin@recipe.com, password: admin123');
    console.log('='.repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;