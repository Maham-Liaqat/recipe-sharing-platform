import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipes, setFilters, setPage, clearFilters } from '../../store/slices/recipeSlice';
import RecipeList from '../../components/recipes/RecipeList';
import RecipeFilters from '../../components/recipes/RecipeFilters';
import SearchBar from '../../components/recipes/SearchBar';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Pagination,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Add, FilterList, ClearAll } from '@mui/icons-material';

const RecipeListPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes, loading, error, total, totalPages, currentPage, filters } = useAppSelector(
    (state) => state.recipes
  );
  const { user } = useAppSelector((state) => state.auth);

  // Sync URL params with Redux state
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    
    // Convert string numbers to actual numbers
    const processedParams = {};
    Object.keys(params).forEach(key => {
      if (key === 'page' || key === 'limit' || key === 'prepTime') {
        processedParams[key] = parseInt(params[key], 10);
      } else {
        processedParams[key] = params[key];
      }
    });
    
    dispatch(setFilters(processedParams));
    
    // Fetch recipes with current params
    dispatch(fetchRecipes(processedParams));
  }, [dispatch, searchParams]);

  const handlePageChange = (event, page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAllFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => 
      value && 
      value !== '' && 
      value !== '-createdAt' && // Default sort
      !['page', 'limit'].includes(key) // Pagination params
  ).length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary">Recipes</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              Discover Recipes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse through our collection of {total} delicious recipes
            </Typography>
          </Box>
          
          {user && (
            <Button
              variant="contained"
              startIcon={<Add />}
              component={Link}
              to="/admin/recipes/create"
              sx={{ borderRadius: 2 }}
            >
              Add Recipe
            </Button>
          )}
        </Box>

        {/* Search Bar */}
        <SearchBar />

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<FilterList />}
                label={`${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}`}
                color="primary"
                variant="outlined"
              />
              
              {Object.entries(filters).map(([key, value]) => {
                if (value && value !== '' && value !== '-createdAt' && !['page', 'limit'].includes(key)) {
                  return (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      onDelete={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete(key);
                        setSearchParams(params);
                      }}
                      sx={{ borderRadius: 1 }}
                    />
                  );
                }
                return null;
              })}
              
              <Button
                size="small"
                startIcon={<ClearAll />}
                onClick={handleClearAllFilters}
                sx={{ ml: 'auto' }}
              >
                Clear All
              </Button>
            </Box>
          </Paper>
        )}

        {/* Filters */}
        <RecipeFilters />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={() => dispatch(fetchRecipes())}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* No Results */}
        {!loading && !error && recipes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No recipes found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {activeFiltersCount > 0 
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to add a recipe!'}
            </Typography>
            {user && (
              <Button
                variant="contained"
                component={Link}
                to="/admin/recipes/create"
                sx={{ mt: 2 }}
              >
                Create Your First Recipe
              </Button>
            )}
          </Box>
        )}

        {/* Recipe Grid */}
        {!loading && recipes.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Showing {recipes.length} of {total} recipe{total !== 1 ? 's' : ''}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPages}
              </Typography>
            </Box>
            
            <RecipeList recipes={recipes} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default RecipeListPage;