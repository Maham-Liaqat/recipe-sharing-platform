import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteRecipe, setFilters } from '../../store/slices/recipeSlice';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  IconButton,
  Rating,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Alert,
  Skeleton,
  Paper,
} from '@mui/material';
import {
  AccessTime,
  Restaurant,
  Favorite,
  FavoriteBorder,
  Share,
  Edit,
  Delete,
  People,
  MoreVert,
  Visibility,
  TrendingUp,
  Star,
  Timer,
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .recipe-image': {
      transform: 'scale(1.05)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  transition: 'transform 0.5s ease',
});

const DifficultyChip = styled(Chip)(({ difficulty, theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  fontWeight: 700,
  fontSize: '0.75rem',
  backgroundColor:
    difficulty === 'easy'
      ? theme.palette.success.main
      : difficulty === 'medium'
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: 'white',
  '& .MuiChip-label': {
    paddingLeft: 8,
    paddingRight: 8,
  },
}));

const TimeChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  fontWeight: 600,
}));

const RecipeList = ({ 
  recipes = [], 
  isLoading = false,
  isEditable = false,
  onRecipeDelete,
  showEmptyState = true,
  gridView = true,
  onViewChange,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading: recipesLoading } = useAppSelector((state) => state.recipes);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  const handleMenuOpen = (event, recipe) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRecipe(recipe);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecipe(null);
  };

  const handleDelete = async (recipe) => {
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      if (onRecipeDelete) {
        onRecipeDelete(recipe._id);
      } else {
        await dispatch(deleteRecipe(recipe._id));
      }
    }
    handleMenuClose();
  };

  const handleShare = (recipe) => {
    const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
    const shareData = {
      title: recipe.title,
      text: recipe.description,
      url: `${origin}/recipes/${recipe._id}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      // You could add a toast notification here
      alert('Recipe link copied to clipboard!');
    }
  };

  const handleFavorite = (recipeId) => {
    setFavorites(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
    // TODO: Implement API call to save favorites
  };

  const handleBookmark = (recipeId) => {
    setBookmarks(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
    // TODO: Implement API call to save bookmarks
  };

  const handleCategoryClick = (category) => {
    dispatch(setFilters({ category }));
  };

  const handleCuisineClick = (cuisine) => {
    dispatch(setFilters({ cuisine }));
  };

  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

  // Loading skeleton
  if (isLoading || recipesLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(8)].map((_, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <StyledCard>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={60} sx={{ ml: 1 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Skeleton variant="rounded" width={80} height={24} />
                  <Skeleton variant="rounded" width={80} height={24} />
                </Box>
              </CardContent>
              <CardActions>
                <Skeleton variant="rounded" width={100} height={36} />
                <Box sx={{ flexGrow: 1 }} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Empty state
  if (recipes.length === 0 && showEmptyState) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Restaurant sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No recipes found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search filters or be the first to create a recipe!
          </Typography>
          {user && (
            <Button
              variant="contained"
              component={Link}
              to="/create-recipe"
              sx={{ borderRadius: 2 }}
            >
              Create Your First Recipe
            </Button>
          )}
        </Box>
      </Paper>
    );
  }

  // Grid view
  if (gridView) {
    return (
      <>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {recipes.map((recipe) => (
            <Grid item key={recipe._id} xs={12} sm={6} md={4} lg={3}>
              <StyledCard>
                {/* Image with overlay */}
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <StyledCardMedia
                    className="recipe-image"
                    component="img"
                    image={recipe.images?.[0] || defaultImage}
                    alt={recipe.title}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                  
                  {/* Difficulty badge */}
                  {recipe.difficulty && (
                    <DifficultyChip
                      difficulty={recipe.difficulty}
                      label={recipe.difficulty.toUpperCase()}
                      size="small"
                    />
                  )}
                  
                  {/* Time badge */}
                  <TimeChip
                    icon={<AccessTime sx={{ fontSize: 14 }} />}
                    label={`${recipe.prepTime} min`}
                    size="small"
                  />
                  
                  {/* Quick actions overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      padding: 2,
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Recipe">
                        <IconButton
                          component={Link}
                          to={`/recipes/${recipe._id}`}
                          sx={{
                            backgroundColor: 'white',
                            '&:hover': { backgroundColor: 'grey.100' },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={favorites[recipe._id] ? 'Remove from favorites' : 'Add to favorites'}>
                        <IconButton
                          onClick={() => handleFavorite(recipe._id)}
                          sx={{
                            backgroundColor: 'white',
                            '&:hover': { backgroundColor: 'grey.100' },
                          }}
                        >
                          {favorites[recipe._id] ? (
                            <Favorite color="error" />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton
                          onClick={() => handleShare(recipe)}
                          sx={{
                            backgroundColor: 'white',
                            '&:hover': { backgroundColor: 'grey.100' },
                          }}
                        >
                          <Share />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Title and description */}
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '3em',
                    }}
                  >
                    {recipe.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {recipe.description}
                  </Typography>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating
                      value={recipe.averageRating || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({recipe.ratingCount || 0})
                    </Typography>
                    {recipe.views > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                        <Visibility sx={{ fontSize: 14, mr: 0.5 }} />
                        {recipe.views}
                      </Typography>
                    )}
                  </Box>

                  {/* Category and cuisine chips */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {recipe.category && (
                      <Chip
                        label={recipe.category}
                        size="small"
                        variant="outlined"
                        onClick={() => handleCategoryClick(recipe.category)}
                        sx={{ cursor: 'pointer', borderRadius: 1 }}
                      />
                    )}
                    {recipe.cuisine && (
                      <Chip
                        label={recipe.cuisine}
                        size="small"
                        variant="outlined"
                        onClick={() => handleCuisineClick(recipe.cuisine)}
                        sx={{ cursor: 'pointer', borderRadius: 1 }}
                      />
                    )}
                  </Box>

                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {recipe.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            backgroundColor: 'grey.100',
                          }}
                        />
                      ))}
                      {recipe.tags.length > 3 && (
                        <Chip
                          label={`+${recipe.tags.length - 3}`}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            backgroundColor: 'grey.100',
                          }}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
                  {/* Author info */}
                  {recipe.author && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={recipe.author.avatar}
                        alt={recipe.author.name}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      >
                        {recipe.author.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {recipe.author.name}
                      </Typography>
                    </Box>
                  )}

                  {/* Action buttons */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Bookmark">
                      <IconButton
                        size="small"
                        onClick={() => handleBookmark(recipe._id)}
                        sx={{ mr: 0.5 }}
                      >
                        {bookmarks[recipe._id] ? (
                          <Bookmark color="primary" />
                        ) : (
                          <BookmarkBorder />
                        )}
                      </IconButton>
                    </Tooltip>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/recipes/${recipe._id}`}
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      View Recipe
                    </Button>
                    
                    {/* More options menu */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, recipe)}
                      sx={{ ml: 0.5 }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* More options menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 200, borderRadius: 2 },
          }}
        >
          <MenuItem
            component={Link}
            to={`/recipes/${selectedRecipe?._id}`}
            onClick={handleMenuClose}
          >
            <Visibility sx={{ mr: 2, fontSize: 20 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleShare(selectedRecipe)}>
            <Share sx={{ mr: 2, fontSize: 20 }} />
            Share Recipe
          </MenuItem>
          <MenuItem onClick={() => handleFavorite(selectedRecipe?._id)}>
            {favorites[selectedRecipe?._id] ? (
              <>
                <Favorite sx={{ mr: 2, fontSize: 20, color: 'error.main' }} />
                Remove from Favorites
              </>
            ) : (
              <>
                <FavoriteBorder sx={{ mr: 2, fontSize: 20 }} />
                Add to Favorites
              </>
            )}
          </MenuItem>
          {isEditable && user && (user.role === 'admin' || user._id === selectedRecipe?.author?._id) && (
            <>
              <MenuItem
                component={Link}
                to={`/admin/recipes/edit/${selectedRecipe?._id}`}
                onClick={handleMenuClose}
              >
                <Edit sx={{ mr: 2, fontSize: 20 }} />
                Edit Recipe
              </MenuItem>
              <MenuItem
                onClick={() => handleDelete(selectedRecipe)}
                sx={{ color: 'error.main' }}
              >
                <Delete sx={{ mr: 2, fontSize: 20 }} />
                Delete Recipe
              </MenuItem>
            </>
          )}
        </Menu>
      </>
    );
  }

  // List view (alternative layout)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {recipes.map((recipe) => (
        <Paper key={recipe._id} sx={{ p: 3, borderRadius: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', height: 200 }}>
                <img
                  src={recipe.images?.[0] || defaultImage}
                  alt={recipe.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {recipe.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={recipe.difficulty}
                      size="small"
                      color={
                        recipe.difficulty === 'easy'
                          ? 'success'
                          : recipe.difficulty === 'medium'
                          ? 'warning'
                          : 'error'
                      }
                    />
                    <Chip
                      icon={<AccessTime sx={{ fontSize: 14 }} />}
                      label={`${recipe.prepTime} min`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {recipe.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={recipe.category}
                      size="small"
                      variant="outlined"
                      onClick={() => handleCategoryClick(recipe.category)}
                      sx={{ cursor: 'pointer' }}
                    />
                    <Chip
                      label={recipe.cuisine}
                      size="small"
                      variant="outlined"
                      onClick={() => handleCuisineClick(recipe.cuisine)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/recipes/${recipe._id}`}
                    >
                      View Recipe
                    </Button>
                    <IconButton size="small" onClick={() => handleShare(recipe)}>
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

// Default props
RecipeList.defaultProps = {
  recipes: [],
  isLoading: false,
  isEditable: false,
  showEmptyState: true,
  gridView: true,
};

export default RecipeList;