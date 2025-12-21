import { Box, Container, Typography, Link as MuiLink, Grid, TextField, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, YouTube, Send } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid',
        borderColor: 'grey.200',
        width: '100%',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 }, px: { xs: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  letterSpacing: '-0.02em',
                }}
              >
                <Box component="span" sx={{ color: 'primary.main' }}>Recipe</Box>
                <Box component="span" sx={{ color: 'secondary.main' }}>Share</Box>
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  lineHeight: 1.7,
                  maxWidth: '90%',
                }}
              >
                Share your culinary creations with the world. Discover amazing recipes
                from chefs and home cooks alike.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <IconButton
                  href="#"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  href="#"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  href="#"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  href="#"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <YouTube />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          {/* Platform Links */}
          <Grid item xs={6} md={2}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                mb: 2.5,
                color: 'text.primary',
              }}
            >
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink 
                component={Link} 
                to="/recipes" 
                color="text.secondary"
                underline="hover"
                sx={{
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Browse Recipes
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/categories" 
                color="text.secondary"
                underline="hover"
                sx={{
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Categories
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/chefs" 
                color="text.secondary"
                underline="hover"
                sx={{
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Top Chefs
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/trending" 
                color="text.secondary"
                underline="hover"
                sx={{
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Trending
              </MuiLink>
            </Box>
          </Grid>
          
          {/* Company Links */}
          <Grid item xs={6} md={2}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                mb: 2.5,
                color: 'text.primary',
              }}
            >
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink 
                component={Link} 
                to="/about" 
                color="text.secondary"
                underline="hover"
                sx={{
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                About Us
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/contact" 
                color="text.secondary"
                underline="hover"
                sx={{
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Contact
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/careers" 
                color="text.secondary"
                underline="hover"
                sx={{
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Careers
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/blog" 
                color="text.secondary"
                underline="hover"
                sx={{
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Blog
              </MuiLink>
            </Box>
          </Grid>
          
          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                mb: 2.5,
                color: 'text.primary',
              }}
            >
              Newsletter
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2.5,
                lineHeight: 1.7,
              }}
            >
              Subscribe to get weekly recipe inspiration and cooking tips!
            </Typography>
            <Box 
              component="form" 
              sx={{ 
                display: 'flex', 
                gap: 1.5,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                size="small"
                placeholder="Your email"
                fullWidth
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'grey.50',
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<Send />}
                sx={{ 
                  borderRadius: 2,
                  minWidth: { xs: '100%', sm: 'auto' },
                  px: 3,
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Bottom Bar */}
        <Box 
          sx={{ 
            mt: { xs: 5, md: 6 }, 
            pt: 4, 
            borderTop: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: { xs: 2, md: 0 },
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              © {new Date().getFullYear()} RecipeShare. All rights reserved.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: { xs: 2, md: 3 },
              }}
            >
              <MuiLink 
                component={Link} 
                to="/privacy" 
                color="text.secondary" 
                underline="hover"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Privacy Policy
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/terms" 
                color="text.secondary" 
                underline="hover"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Terms of Service
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/cookies" 
                color="text.secondary" 
                underline="hover"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Cookies
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;