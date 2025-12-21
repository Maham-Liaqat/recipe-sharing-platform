import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage or token
    const token = localStorage.getItem('recipeToken');
    const userData = localStorage.getItem('recipeUser');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // TODO: Replace with actual API call
      // const response = await authAPI.login({ email, password });
      
      // Mock response for now
      const mockUser = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/300'
      };
      
      setUser(mockUser);
      localStorage.setItem('recipeToken', 'mock-jwt-token');
      localStorage.setItem('recipeUser', JSON.stringify(mockUser));
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('recipeToken');
    localStorage.removeItem('recipeUser');
    toast.success('Logged out successfully');
  };

  const register = async (userData) => {
    try {
      // TODO: Replace with actual API call
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};