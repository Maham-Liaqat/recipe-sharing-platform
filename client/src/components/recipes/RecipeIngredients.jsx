import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import { Circle } from '@mui/icons-material';

const RecipeIngredients = ({ ingredients }) => {
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <span role="img" aria-label="ingredients" style={{ marginRight: '8px' }}>🥕</span>
        Ingredients
      </Typography>
      
      <List>
        {ingredients.map((ingredient, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Circle sx={{ fontSize: 8 }} />
            </ListItemIcon>
            <ListItemText primary={ingredient} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecipeIngredients;