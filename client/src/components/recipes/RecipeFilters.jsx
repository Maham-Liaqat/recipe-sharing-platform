import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setFilters, fetchRecipes } from '../../store/slices/recipeSlice';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  Slider,
  Typography,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Search,
  FilterList,
  ClearAll,
  AccessTime,
  Restaurant,
  TrendingUp,
  Tune,
} from '@mui/icons-material';
import { CUISINES, RECIPE_DIFFICULTY, MEAL_TYPES } from '../../utils/constants';

const RecipeFilters = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [localFilters, setLocalFilters] = useState({
    search: '',
    category: '',
    cuisine: '',
    difficulty: '',
    prepTime: [0, 180],
    tags: [],
    sort: '-createdAt',
    limit: 12,
  });

  // Initialize from URL params
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const filters = {};
    
    if (params.search) filters.search = params.search;
    if (params.category) filters.category = params.category;
    if (params.cuisine) filters.cuisine = params.cuisine;
    if (params.difficulty) filters.difficulty = params.difficulty;
    if (params.sort) filters.sort = params.sort;
    if (params.limit) filters.limit = parseInt(params.limit, 10);
    
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [searchParams]);

  const handleFilterChange = (name, value) => {
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    const filtersToApply = { ...localFilters };
    
    // Convert prepTime range to maxTime
    if (localFilters.prepTime[1] < 180) {
      filtersToApply.maxTime = localFilters.prepTime[1];
      delete filtersToApply.prepTime;
    }
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (value && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });
    
    setSearchParams(params);
    
    // Update Redux and fetch
    dispatch(setFilters(filtersToApply));
    dispatch(fetchRecipes(filtersToApply));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      cuisine: '',
      difficulty: '',
      prepTime: [0, 180],
      tags: [],
      sort: '-createdAt',
      limit: 12,
    };
    
    setLocalFilters(clearedFilters);
    setSearchParams({});
    dispatch(setFilters(clearedFilters));
    dispatch(fetchRecipes({}));
  };

  const hasActiveFilters = () => {
    return (
      localFilters.search ||
      localFilters.category ||
      localFilters.cuisine ||
      localFilters.difficulty ||
      localFilters.prepTime[1] < 180 ||
      localFilters.tags.length > 0
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tune />
          <Typography variant="h6">Filters & Sorting</Typography>
          {hasActiveFilters() && (
            <Chip
              label="Active"
              color="primary"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>
        
        <FormControlLabel
          control={
            <Switch
              checked={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
              color="primary"
            />
          }
          label="Advanced"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Basic Filters */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Recipes"
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={localFilters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {MEAL_TYPES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Cuisine</InputLabel>
            <Select
              value={localFilters.cuisine}
              label="Cuisine"
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Cuisines</MenuItem>
              {CUISINES.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Advanced Filters */}
        {showAdvanced && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={localFilters.difficulty}
                  label="Difficulty"
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {RECIPE_DIFFICULTY.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Results per page</InputLabel>
                <Select
                  value={localFilters.limit}
                  label="Results per page"
                  onChange={(e) => handleFilterChange('limit', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={48}>48</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={localFilters.sort}
                  label="Sort by"
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="-createdAt">Newest First</MenuItem>
                  <MenuItem value="createdAt">Oldest First</MenuItem>
                  <MenuItem value="-averageRating">Highest Rated</MenuItem>
                  <MenuItem value="prepTime">Quickest First</MenuItem>
                  <MenuItem value="-prepTime">Longest First</MenuItem>
                  <MenuItem value="title">A to Z</MenuItem>
                  <MenuItem value="-title">Z to A</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ px: 2 }}>
                <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 1 }} />
                  Prep Time: {localFilters.prepTime[0]} - {localFilters.prepTime[1]} min
                </Typography>
                <Slider
                  value={localFilters.prepTime}
                  onChange={(_, newValue) => handleFilterChange('prepTime', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={180}
                  step={15}
                  marks={[
                    { value: 0, label: '0m' },
                    { value: 30, label: '30m' },
                    { value: 60, label: '1h' },
                    { value: 120, label: '2h' },
                    { value: 180, label: '3h+' },
                  ]}
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </Box>
            </Grid>
          </>
        )}

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ClearAll />}
            onClick={handleClearFilters}
            disabled={!hasActiveFilters()}
            sx={{ borderRadius: 2 }}
          >
            Clear All
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ borderRadius: 2 }}
            >
              {showAdvanced ? 'Less Options' : 'More Options'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={handleApplyFilters}
              sx={{ borderRadius: 2 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecipeFilters;