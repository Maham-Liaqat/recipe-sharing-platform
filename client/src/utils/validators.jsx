// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 6;
  return password.length >= minLength;
};

// Recipe validation
export const validateRecipe = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  if (!data.ingredients || data.ingredients.length === 0 || data.ingredients[0].trim() === '') {
    errors.ingredients = 'At least one ingredient is required';
  }

  if (!data.instructions?.trim()) {
    errors.instructions = 'Instructions are required';
  }

  if (!data.prepTime || data.prepTime < 1) {
    errors.prepTime = 'Prep time must be at least 1 minute';
  }

  if (!data.difficulty) {
    errors.difficulty = 'Please select difficulty level';
  }

  if (!data.category) {
    errors.category = 'Please select a category';
  }

  if (!data.cuisine) {
    errors.cuisine = 'Please select a cuisine';
  }

  if (!data.servings || data.servings < 1) {
    errors.servings = 'Servings must be at least 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Registration validation
export const validateRegistration = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length > 50) {
    errors.name = 'Name must be less than 50 characters';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Login validation
export const validateLogin = (data) => {
  const errors = {};

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Image validation
export const validateImage = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 5MB.',
    };
  }

  return { isValid: true, error: null };
};