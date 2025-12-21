import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipes } from '../../store/slices/recipeSlice';
import RecipeList from '../../components/recipes/RecipeList';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  alpha,
  Paper,
} from '@mui/material';
import {
  Restaurant,
  AccessTime,
  TrendingUp,
  People,
  ArrowForward,
  LocalFireDepartment,
  Star,
  EmojiEvents,
} from '@mui/icons-material';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { recipes, loading } = useAppSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes({ limit: 8, sort: '-createdAt' }));
  }, [dispatch]);

  const features = [
    {
      title: 'Easy Recipe Creation',
      description: 'Create beautiful recipes with our intuitive editor',
      icon: '✨',
      color: '#FF6B6B',
    },
    {
      title: 'Smart Search',
      description: 'Find recipes by ingredients, cuisine, or diet',
      icon: '🔍',
      color: '#4ECDC4',
    },
    {
      title: 'Step-by-Step Guides',
      description: 'Detailed instructions with progress tracking',
      icon: '📝',
      color: '#1DD1A1',
    },
    {
      title: 'Community Ratings',
      description: 'See what others think about each recipe',
      icon: '⭐',
      color: '#FF9F43',
    },
  ];

  const trendingTags = ['Vegetarian', 'Under 30min', 'Keto', 'Dessert', 'Italian', 'Healthy', 'Easy', 'Family'];

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
          mb: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)
            `,
            opacity: 0.8,
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Chip
                  label="New Feature"
                  color="secondary"
                  sx={{ mb: 3, fontWeight: 600 }}
                  icon={<LocalFireDepartment />}
                />
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    color: 'white',
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Share Your
                  <Box component="span" sx={{ color: '#FFD166', display: 'block' }}>
                    Culinary Story
                  </Box>
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
                  Join thousands of food lovers sharing and discovering amazing recipes
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    component={Link}
                    to="/recipes"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    Explore Recipes
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    component={Link}
                    to="/register"
                    sx={{ 
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Join Free
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80"
                alt="Cooking"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  transform: 'rotate(3deg)',
                  animation: 'float 6s ease-in-out infinite',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 }, py: { xs: 4, md: 6 } }}>
        {/* Trending Tags */}
        <Paper 
          sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: { xs: 5, md: 7 }, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocalFireDepartment sx={{ color: 'warning.main', mr: 1.5, fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              Trending Now
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {trendingTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                sx={{
                  px: 2.5,
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  height: 'auto',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                  },
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Features */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #1A1A1A 0%, #4B5563 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Why Choose RecipeShare?
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.8,
              }}
            >
              Everything you need to create, share, and discover amazing recipes from a vibrant community of food lovers
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  border: '2px solid transparent',
                  background: `linear-gradient(white, white) padding-box,
                               linear-gradient(135deg, ${feature.color}15, ${feature.color}30) border-box`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${feature.color}, ${feature.color}80)`,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover::before': {
                    transform: 'scaleX(1)',
                  },
                }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box
                      sx={{
                        width: { xs: 56, md: 72 },
                        height: { xs: 56, md: 72 },
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '1.75rem', md: '2.5rem' },
                        mb: 3,
                        mx: 'auto',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: `0 4px 16px ${feature.color}20`,
                      }}
                      className="pulse"
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 1.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Recipes */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            mb: { xs: 4, md: 5 },
            gap: 2,
          }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 1.5,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #1A1A1A 0%, #4B5563 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Featured Recipes
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Handpicked recipes from our community
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/recipes"
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ 
                fontWeight: 600,
                borderRadius: 3,
                px: 4,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              View All
            </Button>
          </Box>
          
          {loading ? (
            <Typography>Loading recipes...</Typography>
          ) : (
            <RecipeList recipes={recipes} />
          )}
        </Box>

        {/* Stats Section */}
        <Paper
          sx={{
            p: { xs: 4, md: 5 },
            mb: { xs: 4, md: 6 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 5,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
            },
          }}
        >
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    mb: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Restaurant sx={{ fontSize: { xs: 36, md: 48 }, opacity: 1 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                  1,234+
                </Typography>
                <Typography sx={{ opacity: 0.95, fontSize: '1.1rem', fontWeight: 500 }}>
                  Recipes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    mb: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <People sx={{ fontSize: { xs: 36, md: 48 }, opacity: 1 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                  5,678+
                </Typography>
                <Typography sx={{ opacity: 0.95, fontSize: '1.1rem', fontWeight: 500 }}>
                  Food Lovers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    mb: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <AccessTime sx={{ fontSize: { xs: 36, md: 48 }, opacity: 1 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                  45
                </Typography>
                <Typography sx={{ opacity: 0.95, fontSize: '1.1rem', fontWeight: 500 }}>
                  Avg Prep Time
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    mb: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Star sx={{ fontSize: { xs: 36, md: 48 }, opacity: 1 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                  4.8
                </Typography>
                <Typography sx={{ opacity: 0.95, fontSize: '1.1rem', fontWeight: 500 }}>
                  Avg Rating
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;