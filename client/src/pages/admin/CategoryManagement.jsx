import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories } from '../../store/slices/categorySlice';
import { categoryAPI } from '../../api/categoryAPI';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  DialogContentText,
} from '@mui/material';
import { Add, Edit, Delete, Save, Cancel, Refresh } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const CategoryManagement = () => {
  const dispatch = useAppDispatch();
  const { categories: categoriesFromStore, loading } = useAppSelector((state) => state.categories);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    color: '#1976d2', 
    icon: '🍽️',
    description: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoriesFromStore?.data) {
      setCategories(categoriesFromStore.data);
    }
  }, [categoriesFromStore]);

  const loadCategories = async () => {
    await dispatch(fetchCategories());
  };

  const handleEditStart = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
    setEditColor(category.color || '#1976d2');
    setEditIcon(category.icon || '🍽️');
    setEditDescription(category.description || '');
  };

  const handleEditSave = async (id) => {
    try {
      setActionLoading(true);
      const response = await categoryAPI.updateCategory(id, {
        name: editName,
        color: editColor,
        icon: editIcon,
        description: editDescription,
      });
      toast.success('Category updated successfully!');
      await loadCategories();
      setEditingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('#1976d2');
    setEditIcon('🍽️');
    setEditDescription('');
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      setActionLoading(true);
      await categoryAPI.deleteCategory(categoryToDelete._id);
      toast.success('Category deleted successfully!');
      await loadCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setActionLoading(true);
      await categoryAPI.createCategory(newCategory);
      toast.success('Category created successfully!');
      await loadCategories();
      setNewCategory({ name: '', color: '#1976d2', icon: '🍽️', description: '' });
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Category Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadCategories}
            disabled={loading || actionLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            disabled={actionLoading}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {loading && categories.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Category Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Recipe Count</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No categories found. Create your first category!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell>
                        <Typography variant="h5">{category.icon || '🍽️'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            backgroundColor: category.color || '#1976d2',
                            border: '1px solid #ddd',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {editingId === category._id ? (
                          <TextField
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            size="small"
                            fullWidth
                            disabled={actionLoading}
                          />
                        ) : (
                          <Typography>{category.name}</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === category._id ? (
                          <TextField
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            size="small"
                            fullWidth
                            placeholder="Description (optional)"
                            disabled={actionLoading}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {category.description || '-'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={category.recipeCount || 0} size="small" />
                      </TableCell>
                      <TableCell>
                        {editingId === category._id ? (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleEditSave(category._id)}
                              disabled={actionLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={handleEditCancel}
                              disabled={actionLoading}
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleEditStart(category)}
                              disabled={actionLoading}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(category)}
                              disabled={actionLoading}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add Category Dialog */}
      <Dialog open={dialogOpen} onClose={() => !actionLoading && setDialogOpen(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 300 }}>
            <TextField
              autoFocus
              label="Category Name"
              fullWidth
              required
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              sx={{ mb: 2 }}
              disabled={actionLoading}
            />
            <TextField
              label="Icon (emoji)"
              fullWidth
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              placeholder="🍽️"
              sx={{ mb: 2 }}
              disabled={actionLoading}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              sx={{ mb: 2 }}
              disabled={actionLoading}
            />
            <TextField
              label="Color"
              type="color"
              fullWidth
              value={newCategory.color}
              onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
              disabled={actionLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained"
            disabled={actionLoading || !newCategory.name.trim()}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !actionLoading && setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{categoryToDelete?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;