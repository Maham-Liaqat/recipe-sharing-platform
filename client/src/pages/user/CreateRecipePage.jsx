import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import RecipeForm from '../../components/recipes/RecipeForm';

const CreateRecipePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to="/recipes"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Recipes
        </Button>
        
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Create New Recipe
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Share your culinary creation with the world. Fill in all the details below.
        </Typography>
      </Box>
      
      <RecipeForm isEdit={false} />
    </Container>
  );
};

export default CreateRecipePage;