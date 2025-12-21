export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const RECIPE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
};

export const RECIPE_DIFFICULTY = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const MEAL_TYPES = [
  'Breakfast',
  'Brunch',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Appetizer',
  'Side Dish',
];

export const CUISINES = [
  'American',
  'Chinese',
  'French',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Mexican',
  'Thai',
  'Vietnamese',
  'Mediterranean',
  'Middle Eastern',
  'Other',
];

export const PREP_TIME_OPTIONS = [
  { value: '15', label: '15 mins' },
  { value: '30', label: '30 mins' },
  { value: '45', label: '45 mins' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3+ hours' },
];

export const SERVINGS_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1} serving${i > 0 ? 's' : ''}`,
}));