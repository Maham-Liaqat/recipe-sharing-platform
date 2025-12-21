import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryAPI } from '../../api/categoryAPI';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getCategories();
      // API returns { success: true, count: X, data: [...] }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.createCategory(categoryData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.updateCategory(id, categoryData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoryAPI.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
      // API returns { success: true, count: X, data: [...] }
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    builder.addCase(createCategory.fulfilled, (state, action) => {
      if (state.categories?.data) {
        state.categories.data.push(action.payload);
      }
    });
    
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      if (state.categories?.data) {
        const index = state.categories.data.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories.data[index] = action.payload;
        }
      }
    });
    
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      if (state.categories?.data) {
        state.categories.data = state.categories.data.filter(cat => cat._id !== action.payload);
      }
    });
  },
});

export default categorySlice.reducer;