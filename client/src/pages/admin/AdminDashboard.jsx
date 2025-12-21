import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { adminAPI } from '../../api/adminAPI';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Restaurant,
  People,
  RateReview,
  TrendingUp,
  ArrowForward,
  Add,
  Category,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalUsers: 0,
    pendingRecipes: 0,
    totalCategories: 0,
    avgRating: '0.0',
  });
  const [chartData, setChartData] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getDashboardStats();
      const data = response.data.data;
      
      setStats({
        totalRecipes: data.totalRecipes || 0,
        totalUsers: data.totalUsers || 0,
        pendingRecipes: data.pendingRecipes || 0,
        totalCategories: data.totalCategories || 0,
        avgRating: data.avgRating || '0.0',
      });
      
      setChartData(data.chartData || []);
      setRecentRecipes(data.recentRecipes || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Recipes', 
      value: stats.totalRecipes.toLocaleString(), 
      icon: <Restaurant />, 
      color: '#1976d2' 
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: <People />, 
      color: '#2e7d32' 
    },
    { 
      title: 'Pending Reviews', 
      value: stats.pendingRecipes.toLocaleString(), 
      icon: <RateReview />, 
      color: '#ed6c02' 
    },
    { 
      title: 'Avg Rating', 
      value: stats.avgRating, 
      icon: <TrendingUp />, 
      color: '#9c27b0' 
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 800,
            mb: 1.5,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #1A1A1A 0%, #4B5563 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome back, {user?.name || 'Admin'}! 👋
        </Typography>
        <Typography 
          color="text.secondary" 
          sx={{ 
            fontSize: '1.1rem',
            lineHeight: 1.7,
          }}
        >
          Here's what's happening with your recipes today.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${stat.color}08 0%, ${stat.color}03 100%)`,
                border: `1px solid ${stat.color}20`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      color="text.secondary" 
                      variant="body2"
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '0.75rem',
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mt: 1,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      borderRadius: '50%',
                      p: { xs: 1.5, md: 2 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 48, md: 56 },
                      height: { xs: 48, md: 56 },
                      ml: 2,
                    }}
                  >
                    <Box sx={{ color: stat.color, fontSize: { xs: 24, md: 28 } }}>{stat.icon}</Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: { xs: 2.5, md: 4 }, 
              height: '100%',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 3,
                letterSpacing: '-0.01em',
              }}
            >
              Recipes Growth
            </Typography>
            <Box sx={{ height: 300 }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="recipes" stroke="#1976d2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: { xs: 2.5, md: 4 }, 
              height: '100%',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 3,
                letterSpacing: '-0.01em',
              }}
            >
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/admin/recipes/create')}
                fullWidth
              >
                Add New Recipe
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/pending')}
                fullWidth
              >
                Review Pending Recipes
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/categories')}
                fullWidth
              >
                Manage Categories
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/users')}
                fullWidth
              >
                Manage Users
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Recipes */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: { xs: 2.5, md: 4 },
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h5"
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                Recent Recipes
              </Typography>
              <Button
                endIcon={<ArrowForward />}
                onClick={() => navigate('/admin/recipes')}
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Recipe</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentRecipes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">No recent recipes</Typography>
                      </TableCell>
                    </TableRow>
                  ) : recentRecipes.map((recipe) => (
                    <TableRow key={recipe._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={recipe.images?.[0]}
                            alt={recipe.title}
                            sx={{ width: 40, height: 40, borderRadius: 1, mr: 2 }}
                          />
                          <Typography variant="body2">
                            {recipe.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{recipe.author?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip label={recipe.category} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={recipe.status || 'Published'}
                          color={recipe.status === 'pending' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(recipe.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => navigate(`/recipes/${recipe._id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          onClick={() => navigate(`/admin/recipes/edit/${recipe._id}`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;