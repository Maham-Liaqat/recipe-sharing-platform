import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { validateLogin } from '../../utils/validators';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    dispatch(clearError());
    
    if (token) {
      navigate('/');
    }
  }, [token, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
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
    const validation = validateLogin({ [field]: formData[field] });
    if (!validation.isValid) {
      setFormErrors({
        ...formErrors,
        [field]: validation.errors[field],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validation = validateLogin(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setTouched({
        email: true,
        password: true,
      });
      return;
    }

    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  const getFieldError = (field) => {
    return touched[field] ? formErrors[field] : '';
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome Back
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your RecipeShare account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={!!getFieldError('email')}
              helperText={getFieldError('email')}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              error={!!getFieldError('password')}
              helperText={getFieldError('password')}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 3,
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none',
                    fontWeight: 600,
                    color: 'primary.main',
                  }}
                >
                  Create one now
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;