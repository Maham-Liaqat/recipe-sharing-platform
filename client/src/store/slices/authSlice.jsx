import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/authAPI';
import { toast } from 'react-hot-toast';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout();
  return {};
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('recipeUser')) || null,
    token: localStorage.getItem('recipeToken') || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('recipeUser', JSON.stringify(user));
      localStorage.setItem('recipeToken', token);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('recipeUser', JSON.stringify(action.payload.user));
      localStorage.setItem('recipeToken', action.payload.token);
      toast.success('Login successful!');
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Login failed');
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      toast.success('Registration successful! Please login.');
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Registration failed');
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('recipeUser');
      localStorage.removeItem('recipeToken');
      toast.success('Logged out successfully');
    });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;