const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// For multiple images
exports.uploadImages = upload.array('images', 10); // Max 10 images

// For single image
exports.uploadSingle = upload.single('image');

// Cloudinary configuration (optional - for production)
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.cloudinaryUpload = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'recipe-sharing',
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};