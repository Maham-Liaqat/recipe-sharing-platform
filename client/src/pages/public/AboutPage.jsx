import { Container, Typography, Box, Paper, Grid } from '@mui/material';

const AboutPage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          About RecipeShare
        </Typography>
        
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" paragraph>
            Welcome to RecipeShare, your go-to platform for sharing and discovering amazing recipes 
            from food lovers around the world. Our mission is to create a community where everyone 
            can share their culinary creations and learn from others.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Whether you're a professional chef or a home cook, RecipeShare provides the tools you 
            need to create beautiful recipe posts, complete with step-by-step instructions, 
            ingredient lists, and mouth-watering photos.
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Our Vision
              </Typography>
              <Typography variant="body2">
                To become the world's most comprehensive recipe-sharing platform, connecting 
                food enthusiasts across cultures and skill levels.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body2">
                To make cooking more accessible, enjoyable, and social by providing an intuitive 
                platform for recipe sharing and discovery.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutPage;