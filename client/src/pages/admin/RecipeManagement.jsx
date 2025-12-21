import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteRecipe } from '../../store/slices/recipeSlice';
import { recipeAPI } from '../../api/recipeAPI';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Refresh,
  MoreVert,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

const RecipeManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading: deleteLoading } = useAppSelector((state) => state.recipes);
  
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const [loading, setLoading] = useState(true);

  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getAllRecipes({ 
        status: statusFilter !== 'all' ? statusFilter : undefined 
      });
      setRecipes(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecipes();
  }, [statusFilter]);

  const handleDeleteClick = (recipe) => {
    setSelectedRecipe(recipe);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRecipe) {
      try {
        await dispatch(deleteRecipe(selectedRecipe._id));
        await fetchAllRecipes();
        setDeleteDialogOpen(false);
        setSelectedRecipe(null);
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  const handleEdit = (recipe) => {
    navigate(`/admin/recipes/edit/${recipe._id}`);
  };

  const handleView = (recipe) => {
    navigate(`/recipes/${recipe._id}`);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || recipe.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || recipe.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.row.images?.[0]}
          alt={params.row.title}
          sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
        />
      ),
    },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'author', headerName: 'Author', width: 150 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'difficulty',
      headerName: 'Difficulty',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'easy' ? 'success' :
            params.value === 'medium' ? 'warning' : 'error'
          }
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'published' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleView(params.row)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(params.row)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = filteredRecipes.map((recipe, index) => ({
    id: recipe._id || index,
    ...recipe,
    author: recipe.author?.name || 'N/A',
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Recipe Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/recipes/create')}
        >
          Add New Recipe
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
            }}
            size="small"
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Main Course">Main Course</MenuItem>
              <MenuItem value="Dessert">Dessert</MenuItem>
              <MenuItem value="Appetizer">Appetizer</MenuItem>
              <MenuItem value="Breakfast">Breakfast</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
              fetchAllRecipes();
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      {/* Recipes Table */}
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          disableSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedRecipe?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeManagement;