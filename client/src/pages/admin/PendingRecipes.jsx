import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/adminAPI';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Check, Close, Visibility, Edit, Refresh } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const PendingRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, recipe: null, action: null });

  useEffect(() => {
    fetchPendingRecipes();
  }, []);

  const fetchPendingRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getPendingRecipes();
      setRecipes(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending recipes');
      toast.error('Failed to load pending recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!actionDialog.recipe) return;
    
    try {
      await adminAPI.approveRecipe(actionDialog.recipe._id);
      toast.success('Recipe approved successfully!');
      setRecipes(recipes.filter(recipe => recipe._id !== actionDialog.recipe._id));
      setActionDialog({ open: false, recipe: null, action: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve recipe');
    }
  };

  const handleReject = async () => {
    if (!actionDialog.recipe) return;
    
    try {
      await adminAPI.rejectRecipe(actionDialog.recipe._id);
      toast.success('Recipe rejected successfully!');
      setRecipes(recipes.filter(recipe => recipe._id !== actionDialog.recipe._id));
      setActionDialog({ open: false, recipe: null, action: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject recipe');
    }
  };

  const openActionDialog = (recipe, action) => {
    setActionDialog({ open: true, recipe, action });
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, recipe: null, action: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Pending Recipes</Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchPendingRecipes}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipe Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : recipes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No pending recipes at the moment
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recipes.map((recipe) => (
                  <TableRow key={recipe._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {recipe.images?.[0] && (
                          <Box
                            component="img"
                            src={recipe.images[0]}
                            alt={recipe.title}
                            sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                          />
                        )}
                        <Typography variant="body2">{recipe.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{recipe.author?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip label={recipe.category} size="small" />
                    </TableCell>
                    <TableCell>
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip label="Pending" color="warning" size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => navigate(`/recipes/${recipe._id}`)}
                        title="View Recipe"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/admin/recipes/edit/${recipe._id}`)}
                        title="Edit Recipe"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => openActionDialog(recipe, 'approve')}
                        title="Approve Recipe"
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openActionDialog(recipe, 'reject')}
                        title="Reject Recipe"
                      >
                        <Close />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onClose={closeActionDialog}>
        <DialogTitle>
          {actionDialog.action === 'approve' ? 'Approve Recipe' : 'Reject Recipe'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionDialog.action === 'approve' ? 'approve' : 'reject'} the recipe
            "{actionDialog.recipe?.title}"?
            {actionDialog.action === 'reject' && ' This action cannot be undone.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog}>Cancel</Button>
          <Button
            onClick={actionDialog.action === 'approve' ? handleApprove : handleReject}
            color={actionDialog.action === 'approve' ? 'success' : 'error'}
            variant="contained"
          >
            {actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingRecipes;