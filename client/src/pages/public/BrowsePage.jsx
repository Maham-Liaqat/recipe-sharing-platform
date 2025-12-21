import { Container, Typography, Box } from '@mui/material';

const BrowsePage = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Browse Recipes
        </Typography>
        <Typography color="text.secondary">
          This page is under construction. Check back soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default BrowsePage;