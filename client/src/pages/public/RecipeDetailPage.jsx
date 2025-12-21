import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipeById, clearCurrentRecipe } from '../../store/slices/recipeSlice';
import RecipeIngredients from '../../components/recipes/RecipeIngredients';
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Paper,
  Rating,
  Avatar,
  Divider,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccessTime,
  Restaurant,
  People,
  Share,
  Favorite,
  FavoriteBorder,
  Edit,
  Delete,
  ArrowBack,
  CalendarToday,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledImage = styled('img')({
  width: '100%',
  height: '400px',
  objectFit: 'cover',
  borderRadius: '12px',
});

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentRecipe: recipe, loading, error } = useAppSelector((state) => state.recipes);
  const { user } = useAppSelector((state) => state.auth);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
    }

    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      // TODO: Implement delete
      navigate('/recipes');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleRating = (newValue) => {
    setUserRating(newValue);
    // TODO: Implement rating API call
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !recipe) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Recipe not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/recipes')}
          sx={{ mt: 2 }}
        >
          Back to Recipes
        </Button>
      </Container>
    );
  }

  const isEditable = user && (user.role === 'admin' || user._id === recipe.author?._id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/recipes" color="inherit">
          Recipes
        </MuiLink>
        <Typography color="text.primary">{recipe.title}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Recipe Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Images */}
          <Grid item xs={12} md={6}>
            <StyledImage
              src={recipe.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
              alt={recipe.title}
            />
            {recipe.images && recipe.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
                {recipe.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`${recipe.title} ${index + 1}`}
                    sx={{
                      width: 80,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: currentImageIndex === index ? 2 : 1,
                      borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Recipe Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h3" gutterBottom>
                  {recipe.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {recipe.description}
                </Typography>
              </Box>

              {isEditable && (
                <Box>
                  <IconButton
                    component={Link}
                    to={`/admin/recipes/edit/${recipe._id}`}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={handleDelete} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Tags and Info */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip
                icon={<Restaurant />}
                label={recipe.cuisine}
                variant="outlined"
              />
              <Chip
                icon={<AccessTime />}
                label={`${recipe.prepTime} min`}
                variant="outlined"
              />
              <Chip
                icon={<People />}
                label={`${recipe.servings} servings`}
                variant="outlined"
              />
              <Chip
                label={recipe.difficulty}
                color={
                  recipe.difficulty === 'easy' ? 'success' :
                  recipe.difficulty === 'medium' ? 'warning' : 'error'
                }
              />
            </Box>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating
                value={recipe.averageRating || 0}
                precision={0.5}
                readOnly
                size="large"
                sx={{ mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({recipe.ratingCount || 0} ratings)
              </Typography>
              {user && (
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Rate this recipe:
                  </Typography>
                  <Rating
                    value={userRating}
                    onChange={(event, newValue) => handleRating(newValue)}
                    size="large"
                  />
                </Box>
              )}
            </Box>

            {/* Author and Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {recipe.author && (
                <>
                  <Avatar
                    src={recipe.author.avatar}
                    alt={recipe.author.name}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created by
                    </Typography>
                    <Typography variant="body1">
                      {recipe.author.name}
                    </Typography>
                  </Box>
                </>
              )}
              <Box sx={{ ml: 4, display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2" color="text.secondary">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? 'Saved' : 'Save Recipe'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShare}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.print()}
              >
                Print Recipe
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Recipe Content */}
      <Grid container spacing={4}>
        {/* Ingredients */}
        <Grid item xs={12} md={4}>
          <RecipeIngredients ingredients={recipe.ingredients || []} />
          
          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {recipe.tags.map((tag, index) => (
                  <Chip key={index} label={tag} variant="outlined" />
                ))}
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Instructions */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Instructions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                '& h1, & h2, & h3': { mt: 3, mb: 2 },
                '& p': { mb: 2 },
                '& ul, & ol': { pl: 4, mb: 2 },
                '& li': { mb: 1 },
                '& img': { maxWidth: '100%', borderRadius: 1, my: 2 },
              }}
              dangerouslySetInnerHTML={{ __html: recipe.instructions }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeDetailPage;