import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { deleteRecipe } from '../../store/slices/recipeSlice';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
  IconButton,
  Tooltip,
  Avatar,
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
  TrendingUp,
} from '@mui/icons-material';

const RecipeCard = ({ recipe, isEditable = false }) => {
  const dispatch = useAppDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await dispatch(deleteRecipe(recipe._id));
    }
  };

  const handleShare = () => {
    const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
    const recipeUrl = `${origin}/recipes/${recipe._id}`;
    
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
        url: recipeUrl,
      });
    } else {
      navigator.clipboard.writeText(recipeUrl);
      // You can use a toast notification here
    }
  };

  const handleFavorite = async () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite API call
  };

  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80';

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    }}>
      {/* Image Container */}
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={!imageError && recipe.images?.[0] ? recipe.images[0] : defaultImage}
          alt={recipe.title}
          onError={() => setImageError(true)}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        {/* Overlay with gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        
        {/* Top badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
          <Chip
            label={recipe.difficulty}
            size="small"
            sx={{
              backgroundColor: 
                recipe.difficulty === 'easy' ? 'success.main' :
                recipe.difficulty === 'medium' ? 'warning.main' : 'error.main',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
          <Chip
            icon={<AccessTime sx={{ fontSize: 12 }} />}
            label={`${recipe.prepTime} min`}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>
        
        {/* Favorite button */}
        <IconButton
          onClick={handleFavorite}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ color: 'error.main' }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: { xs: 2.5, md: 3 } }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div" 
          noWrap 
          sx={{ 
            fontWeight: 700,
            letterSpacing: '-0.01em',
            mb: 1.5,
          }}
        >
          {recipe.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {recipe.description?.substring(0, 120)}...
        </Typography>

        {/* Rating and stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={recipe.averageRating || 0} readOnly size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              ({recipe.ratingCount || 0})
            </Typography>
          </Box>
          {recipe.servings && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {recipe.servings}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {recipe.cuisine && (
            <Chip
              label={recipe.cuisine}
              size="small"
              variant="outlined"
              icon={<Restaurant sx={{ fontSize: 14 }} />}
              sx={{ borderRadius: 1 }}
            />
          )}
          {recipe.category && (
            <Chip 
              label={recipe.category} 
              size="small" 
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: { xs: 2.5, md: 3 }, pt: 0, justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/recipes/${recipe._id}`}
          sx={{ 
            borderRadius: 3,
            fontWeight: 600,
            px: 3,
          }}
        >
          View Recipe
        </Button>
        
        <Box>
          <Tooltip title="Share">
            <IconButton size="small" onClick={handleShare} sx={{ ml: 1 }}>
              <Share />
            </IconButton>
          </Tooltip>

          {isEditable && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  component={Link}
                  to={`/admin/recipes/edit/${recipe._id}`}
                  sx={{ ml: 1 }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={handleDelete} color="error" sx={{ ml: 1 }}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;