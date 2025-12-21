import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logoutUser } from '../../../store/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Container,
  InputBase,
  Badge,
  alpha,
  styled,
} from '@mui/material';
import {
  Search,
  Menu as MenuIcon,
  Home,
  Restaurant,
  Person,
  ExitToApp,
  Dashboard,
  FavoriteBorder,
  Add,
  Notifications,
} from '@mui/icons-material';

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 50,
  backgroundColor: alpha(theme.palette.grey[100], 0.8),
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  marginLeft: theme.spacing(2),
  width: '100%',
  maxWidth: 400,
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500],
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: { xs: 1.5, md: 2 }, minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 2, md: 4 } }}>
            <IconButton
              size="large"
              edge="start"
              color="primary"
              sx={{ 
                mr: 1,
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(78, 205, 196, 0.2) 100%)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={() => navigate('/')}
            >
              <Restaurant sx={{ fontSize: { xs: 24, md: 28 } }} />
            </IconButton>
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                display: { xs: 'none', md: 'block' },
                letterSpacing: '-0.02em',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              RecipeShare
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, gap: 0.5 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<Home />}
              sx={{ 
                color: 'text.primary',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 107, 0.08)',
                  color: 'primary.main',
                },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/recipes"
              startIcon={<Restaurant />}
              sx={{ 
                color: 'text.primary',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(78, 205, 196, 0.08)',
                  color: 'secondary.main',
                },
              }}
            >
              Recipes
            </Button>
            <Button
              component={Link}
              to="/browse"
              startIcon={<Restaurant />}
              sx={{ 
                color: 'text.primary',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(29, 209, 161, 0.08)',
                  color: 'success.main',
                },
              }}
            >
              Browse
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <SearchBar>
              <form onSubmit={handleSearch}>
                <SearchIconWrapper>
                  <Search />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search recipes, ingredients, cuisines…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </SearchBar>
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {user ? (
              <>
                {/* CREATE RECIPE BUTTON - VISIBLE TO ALL LOGGED-IN USERS */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => navigate('/create-recipe')}
                  sx={{ 
                    mr: 2,
                    borderRadius: 2,
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  Create Recipe
                </Button>
                
                <IconButton
                  color="primary"
                  onClick={() => navigate('/create-recipe')}
                  sx={{ 
                    mr: 1,
                    display: { xs: 'flex', sm: 'none' }
                  }}
                  title="Create Recipe"
                >
                  <Add />
                </IconButton>
                
                <IconButton color="primary" sx={{ mr: 1 }}>
                  <Badge badgeContent={3} color="error">
                    <FavoriteBorder />
                  </Badge>
                </IconButton>
                
                <IconButton color="primary" sx={{ mr: 2 }}>
                  <Badge badgeContent={5} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
                
                {/* DASHBOARD BUTTON - ONLY FOR ADMINS */}
                {user.role === 'admin' && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Dashboard />}
                    component={Link}
                    to="/admin"
                    sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                  >
                    Dashboard
                  </Button>
                )}
                
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ 
                    p: 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  aria-label="account menu"
                >
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    sx={{ 
                      width: { xs: 36, md: 44 }, 
                      height: { xs: 36, md: 44 }, 
                      border: '3px solid', 
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                    }}
                  >
                    {user.name?.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                    },
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    <Person sx={{ mr: 2, fontSize: 20 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/my-recipes'); handleMenuClose(); }}>
                    <Restaurant sx={{ mr: 2, fontSize: 20 }} /> My Recipes
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/saved'); handleMenuClose(); }}>
                    <FavoriteBorder sx={{ mr: 2, fontSize: 20 }} /> Saved Recipes
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                      <Dashboard sx={{ mr: 2, fontSize: 20 }} /> Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 2, fontSize: 20 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{ mr: 1, color: 'text.primary' }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/register"
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;