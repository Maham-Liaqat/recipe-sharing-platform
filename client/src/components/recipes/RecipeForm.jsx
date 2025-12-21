import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createRecipe, updateRecipe, fetchRecipeById } from '../../store/slices/recipeSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../../utils/cloudinary';
import { validateRecipe } from '../../utils/validators';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  LinearProgress,
  FormHelperText,
  Autocomplete,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Delete,
  CloudUpload,
  Save,
  ArrowBack,
  Image as ImageIcon,
  Close,
  Info,
  Timer,
  Restaurant,
  People,
  TrendingUp,
  CheckCircle,
  Warning,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Image,
  Title,
  Code,
  FormatQuote,
  Help,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { CUISINES, RECIPE_DIFFICULTY, PREP_TIME_OPTIONS } from '../../utils/constants';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Rich text formatting buttons component
const RichTextToolbar = ({ onFormat, onOpenFormatHelp }) => {
  const formats = [
    { type: 'bold', icon: <FormatBold />, label: 'Bold' },
    { type: 'italic', icon: <FormatItalic />, label: 'Italic' },
    { type: 'underline', icon: <FormatUnderlined />, label: 'Underline' },
    { type: 'bullet', icon: <FormatListBulleted />, label: 'Bullet List' },
    { type: 'number', icon: <FormatListNumbered />, label: 'Numbered List' },
    { type: 'h2', icon: <Title />, label: 'Heading' },
    { type: 'quote', icon: <FormatQuote />, label: 'Quote' },
    { type: 'code', icon: <Code />, label: 'Code/Inline Code' },
    { type: 'link', icon: <Link />, label: 'Add Link' },
    { type: 'image', icon: <Image />, label: 'Add Image URL' },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 0.5, 
      p: 1, 
      borderBottom: 1, 
      borderColor: 'divider',
      backgroundColor: 'grey.50',
      borderRadius: '8px 8px 0 0',
      alignItems: 'center'
    }}>
      {formats.map((format) => (
        <Tooltip key={format.type} title={format.label}>
          <IconButton
            size="small"
            onClick={() => onFormat(format.type)}
            sx={{
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {format.icon}
          </IconButton>
        </Tooltip>
      ))}
      <Box sx={{ flexGrow: 1 }} />
      <Tooltip title="Formatting Help">
        <IconButton
          size="small"
          onClick={onOpenFormatHelp}
          sx={{
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Help />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// Formatting Help Dialog
const FormattingHelpDialog = ({ open, onClose }) => {
  const formattingExamples = [
    { syntax: '**bold text**', result: 'bold text', description: 'Bold text' },
    { syntax: '*italic text*', result: 'italic text', description: 'Italic text' },
    { syntax: '<u>underlined</u>', result: 'underlined', description: 'Underlined text' },
    { syntax: '## Heading', result: 'Heading', description: 'Section heading' },
    { syntax: '[link text](https://example.com)', result: 'link text', description: 'Hyperlink' },
    { syntax: '![alt text](https://example.com/image.jpg)', result: '(image)', description: 'Image' },
    { syntax: '1. First item\n2. Second item', result: 'Numbered list', description: 'Numbered list' },
    { syntax: '- Item\n- Another item', result: 'Bullet list', description: 'Bullet list' },
    { syntax: '> Quote text', result: 'Quote text', description: 'Blockquote' },
    { syntax: '`inline code`', result: 'inline code', description: 'Inline code' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Formatting Guide</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          Use the following syntax to format your recipe instructions:
        </Typography>
        
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mt: 2 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>Syntax</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>Result</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {formattingExamples.map((example, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0', fontFamily: 'monospace' }}>
                  {example.syntax}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                  {example.result}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                  {example.description}
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
        
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Tips:
          </Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
            <li>Use numbered steps for cooking instructions</li>
            <li>Add empty lines between steps for better readability</li>
            <li>You can also use the toolbar buttons to automatically insert formatting</li>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const RecipeForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { currentRecipe, loading: recipeLoading } = useAppSelector((state) => state.recipes);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.categories);
  const { user } = useAppSelector((state) => state.auth);
  
  const fileInputRef = useRef(null);
  const instructionsTextareaRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: '',
    prepTime: '',
    difficulty: '',
    category: '',
    cuisine: '',
    servings: '',
    tags: [],
    images: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [newIngredient, setNewIngredient] = useState('');
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [showFormatHelp, setShowFormatHelp] = useState(false);

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Formatting helper functions
  const applyFormat = (type) => {
    const textarea = instructionsTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.instructions.substring(start, end);
    let formattedText = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        cursorOffset = 3;
        break;
      case 'bullet':
        formattedText = `\n• ${selectedText}`;
        cursorOffset = 3;
        break;
      case 'number':
        formattedText = `\n1. ${selectedText}`;
        cursorOffset = 4;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText}`;
        cursorOffset = 4;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText}`;
        cursorOffset = 3;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        cursorOffset = 1;
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          formattedText = `[${selectedText}](${url})`;
          cursorOffset = 0;
        } else {
          formattedText = selectedText;
        }
        break;
      case 'image':
        const imgUrl = prompt('Enter image URL:', 'https://');
        if (imgUrl) {
          const altText = prompt('Enter alt text (description):', selectedText || 'Recipe image');
          formattedText = `![${altText}](${imgUrl})`;
          cursorOffset = 0;
        } else {
          formattedText = selectedText;
        }
        break;
      default:
        formattedText = selectedText;
    }

    const newInstructions = 
      formData.instructions.substring(0, start) + 
      formattedText + 
      formData.instructions.substring(end);

    setFormData({
      ...formData,
      instructions: newInstructions,
    });

    // Update cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length - (selectedText ? cursorOffset : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Insert text at cursor position
  const insertTextAtCursor = (textToInsert) => {
    const textarea = instructionsTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newInstructions = 
      formData.instructions.substring(0, start) + 
      textToInsert + 
      formData.instructions.substring(end);

    setFormData({
      ...formData,
      instructions: newInstructions,
    });

    // Place cursor inside the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Popular tags for suggestions
  const popularTags = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto',
    'Low-Carb', 'High-Protein', 'Quick', 'Easy', 'Family-Friendly',
    'Healthy', 'Comfort Food', 'Meal Prep', 'One-Pot', 'Budget-Friendly',
    'Gourmet', 'Holiday', 'Summer', 'Winter', 'Spring', 'Fall',
    'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer'
  ];

  useEffect(() => {
    dispatch(fetchCategories());

    if (isEdit && id) {
      dispatch(fetchRecipeById(id));
    }
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && currentRecipe) {
      setFormData({
        title: currentRecipe.title || '',
        description: currentRecipe.description || '',
        ingredients: currentRecipe.ingredients || [''],
        instructions: currentRecipe.instructions || '',
        prepTime: currentRecipe.prepTime?.toString() || '',
        difficulty: currentRecipe.difficulty || '',
        category: currentRecipe.category || '',
        cuisine: currentRecipe.cuisine || '',
        servings: currentRecipe.servings?.toString() || '',
        tags: currentRecipe.tags || [],
        images: [],
      });
      setExistingImages(currentRecipe.images || []);
    }
  }, [currentRecipe, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true,
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true,
    });
    
    // Validate single field
    const validation = validateRecipe({ [field]: formData[field] });
    if (!validation.isValid && validation.errors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: validation.errors[field],
      });
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({
      ...formData,
      ingredients: newIngredients,
    });
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, ingredientInput.trim()],
      });
      setIngredientInput('');
    }
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ingredients: newIngredients.length > 0 ? newIngredients : [''],
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleTagSelect = (event, value) => {
    if (value && !formData.tags.includes(value)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, value],
      });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setSubmitError(`Invalid file type: ${file.name}. Please upload JPEG, PNG, or WebP images.`);
        return false;
      }
      
      if (file.size > maxSize) {
        setSubmitError(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Check total images limit
    const totalImages = existingImages.length + formData.images.length + validFiles.length;
    if (totalImages > 10) {
      setSubmitError('Maximum 10 images allowed per recipe');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setSubmitError('');

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Upload to Cloudinary
      const uploadedUrls = await uploadMultipleToCloudinary(validFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Add new images to form
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      setSubmitError('Failed to upload images. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const handleInstructionsChange = (e) => {
    setFormData({
      ...formData,
      instructions: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate entire form
    const validation = validateRecipe(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      
      // Scroll to first error
      const firstError = Object.keys(validation.errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      
      return;
    }

    // Validate images
    if (existingImages.length + formData.images.length === 0) {
      setSubmitError('At least one image is required');
      return;
    }

    try {
      // Prepare recipe data
      const recipeData = {
        ...formData,
        prepTime: parseInt(formData.prepTime),
        servings: parseInt(formData.servings),
        images: [...existingImages, ...formData.images],
        // For regular users, set status to pending
        status: user?.role === 'admin' ? 'published' : 'pending',
      };

      if (isEdit) {
        await dispatch(updateRecipe({ id, recipeData })).unwrap();
      } else {
        await dispatch(createRecipe(recipeData)).unwrap();
      }
      
      // Redirect based on user role
      if (user?.role === 'admin') {
        navigate('/admin/recipes');
      } else {
        navigate('/my-recipes');
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to save recipe');
    }
  };

  const getFieldError = (field) => {
    return touched[field] ? formErrors[field] : '';
  };

  const isFieldValid = (field) => {
    return touched[field] && !formErrors[field];
  };

  if (recipeLoading || categoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <FormattingHelpDialog 
        open={showFormatHelp} 
        onClose={() => setShowFormatHelp(false)} 
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {isEdit ? 'Edit Recipe' : 'Create New Recipe'}
        </Typography>
      </Box>

      {submitError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setSubmitError('')}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        >
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recipe Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={() => handleBlur('title')}
              error={!!getFieldError('title')}
              helperText={getFieldError('title')}
              required
              InputProps={{
                endAdornment: isFieldValid('title') && (
                  <InputAdornment position="end">
                    <CheckCircle color="success" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              error={!!getFieldError('description')}
              helperText={`${formData.description.length}/500 ${getFieldError('description') || ''}`}
              multiline
              rows={3}
              required
              InputProps={{
                endAdornment: isFieldValid('description') && (
                  <InputAdornment position="end">
                    <CheckCircle color="success" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          {/* Category, Cuisine, Difficulty */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!getFieldError('category')}>
              <InputLabel>Category *</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={() => handleBlur('category')}
                label="Category *"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {safeCategories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              {getFieldError('category') && (
                <FormHelperText>{getFieldError('category')}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!getFieldError('cuisine')}>
              <InputLabel>Cuisine *</InputLabel>
              <Select
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                onBlur={() => handleBlur('cuisine')}
                label="Cuisine *"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <em>Select Cuisine</em>
                </MenuItem>
                {CUISINES.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
              {getFieldError('cuisine') && (
                <FormHelperText>{getFieldError('cuisine')}</FormHelperText>
              )}
            </FormControl>
  </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!getFieldError('difficulty')}>
              <InputLabel>Difficulty *</InputLabel>
              <Select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                onBlur={() => handleBlur('difficulty')}
                label="Difficulty *"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <em>Select Difficulty</em>
                </MenuItem>
                {RECIPE_DIFFICULTY.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
              {getFieldError('difficulty') && (
                <FormHelperText>{getFieldError('difficulty')}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Prep Time and Servings */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!getFieldError('prepTime')}>
              <InputLabel>Prep Time *</InputLabel>
              <Select
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                onBlur={() => handleBlur('prepTime')}
                label="Prep Time *"
                startAdornment={
                  <InputAdornment position="start">
                    <Timer sx={{ ml: 1, color: 'action.active' }} />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <em>Select Prep Time</em>
                </MenuItem>
                {PREP_TIME_OPTIONS.map((time) => (
                  <MenuItem key={time.value} value={time.value}>
                    {time.label}
                  </MenuItem>
                ))}
              </Select>
              {getFieldError('prepTime') && (
                <FormHelperText>{getFieldError('prepTime')}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Servings"
              name="servings"
              type="number"
              value={formData.servings}
              onChange={handleChange}
              onBlur={() => handleBlur('servings')}
              error={!!getFieldError('servings')}
              helperText={getFieldError('servings')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <People sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
                inputProps: { min: 1, max: 50 },
              }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          {/* Ingredients */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              Ingredients *
              <Tooltip title="List all ingredients with quantities">
                <Info sx={{ ml: 1, fontSize: 20, color: 'text.secondary' }} />
              </Tooltip>
            </Typography>
            
            {formErrors.ingredients && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {formErrors.ingredients}
              </Alert>
            )}
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              {formData.ingredients.map((ingredient, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={`${index + 1}`}
                    size="small"
                    sx={{ width: 40, fontWeight: 600 }}
                  />
                  <TextField
                    fullWidth
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1} (e.g., 2 cups flour)`}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  {formData.ingredients.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => removeIngredient(index)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              ))}
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Add new ingredient"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addIngredient}
                  disabled={!ingredientInput.trim()}
                  sx={{ borderRadius: 2 }}
                >
                  Add
                </Button>
              </Box>
            </Stack>
          </Grid>

          {/* Instructions */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              Instructions *
              <Tooltip title="Add step-by-step instructions. Use the toolbar to format your text.">
                <Info sx={{ ml: 1, fontSize: 20, color: 'text.secondary' }} />
              </Tooltip>
            </Typography>
            
            {formErrors.instructions && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {formErrors.instructions}
              </Alert>
            )}
            
            <Box sx={{ 
              border: formErrors.instructions ? '1px solid #f44336' : '1px solid #e0e0e0', 
              borderRadius: 2, 
              overflow: 'hidden' 
            }}>
              <RichTextToolbar 
                onFormat={applyFormat} 
                onOpenFormatHelp={() => setShowFormatHelp(true)}
              />
              
              <TextField
                inputRef={instructionsTextareaRef}
                id="instructions"
                fullWidth
                multiline
                rows={12}
                value={formData.instructions}
                onChange={handleInstructionsChange}
                onBlur={() => handleBlur('instructions')}
                placeholder="Enter step-by-step instructions here...
• Use numbered steps for better readability
• Add formatting using toolbar buttons
• Separate steps with empty lines"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    '& textarea': {
                      resize: 'vertical',
                    }
                  },
                }}
                InputProps={{
                  style: {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {formData.instructions.length} characters • {formData.instructions.split('\n').length} lines
              </Typography>
              
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => insertTextAtCursor('\n\n### Next Step:\n\n')}
                sx={{ textTransform: 'none' }}
              >
                Add Step
              </Button>
            </Box>
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Tags
              <Tooltip title="Add tags to help others find your recipe">
                <Info sx={{ ml: 1, fontSize: 20, color: 'text.secondary' }} />
              </Tooltip>
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              {formData.tags.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tags added yet. Tags help others discover your recipe.
                </Typography>
              )}
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    sx={{ borderRadius: 2 }}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  freeSolo
                  options={popularTags.filter(tag => !formData.tags.includes(tag))}
                  onChange={handleTagSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Or select popular tags"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              Images
              <Tooltip title="Upload high-quality images of your recipe. Maximum 10 images, 5MB each.">
                <Info sx={{ ml: 1, fontSize: 20, color: 'text.secondary' }} />
              </Tooltip>
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                disabled={uploading || (existingImages.length + formData.images.length >= 10)}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  py: 1.5,
                }}
              >
                {uploading ? 'Uploading...' : 'Upload Images'}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  ref={fileInputRef}
                />
              </Button>
              
              {uploading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {uploadProgress}% uploaded
                  </Typography>
                </Box>
              )}
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Upload up to 10 images (JPEG, PNG, WebP, max 5MB each). 
                {existingImages.length + formData.images.length > 0 && (
                  <> {existingImages.length + formData.images.length} image(s) uploaded.</>
                )}
              </Typography>
            </Box>
            
            {/* Image Previews */}
            {(existingImages.length > 0 || formData.images.length > 0) ? (
              <Grid container spacing={2}>
                {/* Existing Images */}
                {existingImages.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={`existing-${index}`}>
                    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                      <img
                        src={image}
                        alt={`Existing ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': {
                            backgroundColor: 'white',
                          },
                        }}
                        onClick={() => removeImage(index, true)}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                      <Chip
                        label="Existing"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
                
                {/* New Images */}
                {formData.images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={`new-${index}`}>
                    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                      <img
                        src={image}
                        alt={`New ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': {
                            backgroundColor: 'white',
                          },
                        }}
                        onClick={() => removeImage(index, false)}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                      <Chip
                        label="New"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 3,
                  backgroundColor: 'grey.50',
                }}
              >
                <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No images uploaded yet. Click the button above to upload recipe images.
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 3,
              borderTop: 1,
              borderColor: 'divider',
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Required fields are marked with *
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All fields are validated before submission
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={recipeLoading || uploading}
                  sx={{ 
                    borderRadius: 2,
                    px: 4,
                    fontWeight: 600,
                  }}
                >
                  {recipeLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isEdit ? (
                    'Update Recipe'
                  ) : (
                    'Create Recipe'
                  )}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RecipeForm;