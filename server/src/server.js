const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cloudinary = require('cloudinary').v2; // Add Cloudinary
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

// Configure Cloudinary
const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    console.log(`✅ Cloudinary configured: ${cloudName}`);
    return true;
  } else {
    console.log('⚠️  Cloudinary not fully configured. Missing environment variables.');
    console.log(`   CLOUDINARY_CLOUD_NAME: ${cloudName ? 'Set' : 'Missing'}`);
    console.log(`   CLOUDINARY_API_KEY: ${apiKey ? 'Set' : 'Missing'}`);
    console.log(`   CLOUDINARY_API_SECRET: ${apiSecret ? 'Set' : 'Missing'}`);
    return false;
  }
};

// Initialize Cloudinary
const cloudinaryConfigured = configureCloudinary();

// CORS Configuration for Production
const allowedOrigins = () => {
  const origins = ['http://localhost:3000'];
  
  // Add production URLs
  if (process.env.NODE_ENV === 'production') {
    origins.push(
      'https://recipe-sharing-frontend.vercel.app',  // Your Vercel app
      'https://recipe-sharing-platform-tawny.vercel.app'  // Actual deployed Vercel app
    );
  }
  
  // Always allow Vercel deployments (for preview deployments too)
  origins.push('https://recipe-sharing-platform-tawny.vercel.app');
  
  // Allow custom frontend URL from environment
  if (process.env.FRONTEND_URL) {
    const frontendUrls = Array.isArray(process.env.FRONTEND_URL) 
      ? process.env.FRONTEND_URL 
      : process.env.FRONTEND_URL.split(',');
    origins.push(...frontendUrls.map(url => url.trim()));
  }
  
  // Add Render frontend if using (optional)
  if (process.env.RENDER_EXTERNAL_URL) {
    origins.push(process.env.RENDER_EXTERNAL_URL.replace('/api', ''));
  }
  
  return origins;
};

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.log('⚠️  Starting server without database connection...');
      return false;
    }
    
    console.log(`Connecting to MongoDB Atlas...`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased to 10s for Render
      socketTimeoutMS: 45000,
      maxPoolSize: 10 // Connection pool size
    });
    
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📈 Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected - attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });
    
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Starting server without database connection...');
    return false;
  }
};

// Connect to database
const dbConnected = connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.cloudinary.com", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.cloudinary.com"]
    }
  } : false,
}));

// CORS Middleware with dynamic origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowed = allowedOrigins();
    
    // Check if origin is in allowed list
    const isAllowed = allowed.some(allowedOrigin => {
      // Handle wildcard origins like *.vercel.app
      if (allowedOrigin.includes('*')) {
        const regex = new RegExp('^' + allowedOrigin.replace('*', '.*').replace(/\./g, '\\.') + '$');
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      return callback(null, true);
    } else {
      console.log(`CORS blocked: ${origin}`);
      console.log(`Allowed origins: ${JSON.stringify(allowed)}`);
      return callback(null, true); // Allow all for now, change to callback(new Error(...)) for production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Request-Id']
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50mb' })); // Increased for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static folder for uploaded images (if using local uploads)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Cloudinary test endpoint
app.get('/api/cloudinary/test', async (req, res) => {
  if (!cloudinaryConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Cloudinary not configured',
      instructions: 'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables'
    });
  }
  
  try {
    const result = await cloudinary.api.ping();
    res.status(200).json({
      success: true,
      message: 'Cloudinary connection successful',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
  }
});

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🎉 Welcome to Recipe Sharing Platform API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      host: mongoose.connection.host || 'Not connected'
    },
    cloudinary: cloudinaryConfigured ? 'Configured' : 'Not configured',
    server: {
      status: 'online',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    },
    endpoints: {
      auth: '/api/auth',
      recipes: '/api/recipes',
      categories: '/api/categories',
      users: '/api/users',
      health: '/api/health',
      admin: '/api/admin',
      cloudinaryTest: '/api/cloudinary/test'
    }
  });
});

// Health check endpoint (CRITICAL for Render monitoring)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
  
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    service: 'Recipe Sharing API',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: dbStatus,
      cloudinary: cloudinaryConfigured ? 'configured' : 'not_configured',
      memory: process.memoryUsage().heapUsed < 500000000 ? 'healthy' : 'warning' // Less than 500MB
    },
    metrics: {
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
      },
      nodeVersion: process.version
    },
    links: {
      documentation: 'https://github.com/Maham-Liaqat/recipe-sharing-platform',
      github: 'https://github.com/Maham-Liaqat/recipe-sharing-platform'
    }
  });
});

// Cloudinary utility endpoint (optional)
app.post('/api/cloudinary/upload', express.json({ limit: '10mb' }), async (req, res) => {
  if (!cloudinaryConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Cloudinary not configured'
    });
  }
  
  try {
    const { image, folder = 'recipes' } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided'
      });
    }
    
    // If image is base64
    const result = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });
    
    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/cloudinary/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/recipes',
      'GET /api/categories',
      'POST /api/cloudinary/upload'
    ]
  });
});

// For non-API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    note: 'This is the backend API. Frontend should be running separately.',
    frontendUrl: 'https://recipe-sharing-frontend.vercel.app'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ============================================
  🚀 Recipe Sharing Platform Backend
  ============================================
  Environment: ${process.env.NODE_ENV || 'development'}
  Port: ${PORT}
  Host: 0.0.0.0
  Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
  Cloudinary: ${cloudinaryConfigured ? '✅ Configured' : '❌ Not configured'}
  Server URL: http://localhost:${PORT}
  Health Check: http://localhost:${PORT}/api/health
  Cloudinary Test: http://localhost:${PORT}/api/cloudinary/test
  Allowed Origins: ${JSON.stringify(allowedOrigins())}
  ============================================
  `);
  
  // Log startup warnings
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  WARNING: MONGODB_URI environment variable is not set!');
  }
  
  if (!cloudinaryConfigured) {
    console.warn('⚠️  WARNING: Cloudinary not fully configured. Image uploads may not work.');
    console.warn('     Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  }
});