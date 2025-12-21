const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'recipe-sharing';

export const uploadToCloudinary = async (file) => {
  // For development/testing, return a mock URL
  if (process.env.NODE_ENV === 'development' && !CLOUDINARY_CLOUD_NAME) {
    console.warn('Cloudinary not configured, using mock image URL');
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&auto=format&fit=crop`;
        resolve(mockUrl);
      }, 500);
    });
  }

  // For production with Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
  formData.append('folder', 'recipe-sharing');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

export const uploadMultipleToCloudinary = async (files) => {
  const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
  const results = await Promise.allSettled(uploadPromises);
  
  const successfulUploads = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
    
  return successfulUploads;
};

// Generate Cloudinary URL with transformations
export const getOptimizedImageUrl = (url, options = {}) => {
  // Handle non-string values safely
  if (!url || typeof url !== 'string') {
    return url || '';
  }
  
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  // Insert transformations into Cloudinary URL
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};