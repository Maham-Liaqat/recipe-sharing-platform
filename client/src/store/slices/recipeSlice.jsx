import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recipeAPI } from '../../api/recipeAPI';
import { toast } from 'react-hot-toast';

// Async thunks
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.getRecipes(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch recipes');
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.getRecipe(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch recipe');
    }
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/createRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.createRecipe(recipeData);
      toast.success('Recipe created successfully!');
      return response.data.data;
    } catch (error) {
      const errorMsg = error.data?.errors?.[0]?.msg || error.message || 'Failed to create recipe';
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, recipeData }, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.updateRecipe(id, recipeData);
      toast.success('Recipe updated successfully!');
      return response.data.data;
    } catch (error) {
      const errorMsg = error.data?.errors?.[0]?.msg || error.message || 'Failed to update recipe';
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, { rejectWithValue }) => {
    try {
      await recipeAPI.deleteRecipe(id);
      toast.success('Recipe deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.message || 'Failed to delete recipe');
      return rejectWithValue(error.message);
    }
  }
);

export const rateRecipe = createAsyncThunk(
  'recipes/rateRecipe',
  async ({ id, rating, review }, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.rateRecipe(id, { rating, review });
      toast.success('Rating submitted successfully!');
      return response.data.data;
    } catch (error) {
      toast.error(error.message || 'Failed to submit rating');
      return rejectWithValue(error.message);
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    currentRecipe: null,
    loading: false,
    error: null,
    total: 0,
    totalPages: 1,
    currentPage: 1,
    filters: {
      search: '',
      category: '',
      cuisine: '',
      difficulty: '',
      prepTime: '',
      sort: '-createdAt',
    },
  },
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        cuisine: '',
        difficulty: '',
        prepTime: '',
        sort: '-createdAt',
      };
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch recipes
    builder.addCase(fetchRecipes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRecipes.fulfilled, (state, action) => {
      state.loading = false;
      state.recipes = action.payload.data || [];
      state.total = action.payload.count || 0;
      state.totalPages = action.payload.pagination?.pages || 1;
      state.currentPage = action.payload.pagination?.currentPage || 1;
    });
    builder.addCase(fetchRecipes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch single recipe
    builder.addCase(fetchRecipeById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRecipeById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentRecipe = action.payload;
    });
    builder.addCase(fetchRecipeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create recipe
    builder.addCase(createRecipe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRecipe.fulfilled, (state, action) => {
      state.loading = false;
      state.recipes.unshift(action.payload);
    });
    builder.addCase(createRecipe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update recipe
    builder.addCase(updateRecipe.fulfilled, (state, action) => {
      const index = state.recipes.findIndex(recipe => recipe._id === action.payload._id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
      if (state.currentRecipe && state.currentRecipe._id === action.payload._id) {
        state.currentRecipe = action.payload;
      }
    });

    // Delete recipe
    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      state.recipes = state.recipes.filter(recipe => recipe._id !== action.payload);
    });

    // Rate recipe
    builder.addCase(rateRecipe.fulfilled, (state, action) => {
      if (state.currentRecipe && state.currentRecipe._id === action.payload._id) {
        state.currentRecipe = action.payload;
      }
    });
  },
});

export const { clearCurrentRecipe, setFilters, clearFilters, setPage } = recipeSlice.actions;
export default recipeSlice.reducer;