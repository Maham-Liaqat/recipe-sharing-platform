import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './components/common/LoadingSpinner';
import Layout from './components/common/Layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/public/HomePage'));
const RecipeListPage = lazy(() => import('./pages/public/RecipeListPage'));
const RecipeDetailPage = lazy(() => import('./pages/public/RecipeDetailPage'));
const BrowsePage = lazy(() => import('./pages/public/BrowsePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const CreateRecipePage = lazy(() => import('./pages/user/CreateRecipePage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const RecipeManagement = lazy(() => import('./pages/admin/RecipeManagement'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const PendingRecipes = lazy(() => import('./pages/admin/PendingRecipes'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, token } = useSelector((state) => state.auth);
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="recipes" element={<RecipeListPage />} />
          <Route path="recipes/:id" element={<RecipeDetailPage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected User Routes */}
          <Route 
            path="create-recipe" 
            element={
              <ProtectedRoute>
                <CreateRecipePage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="recipes" element={<RecipeManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="pending" element={<PendingRecipes />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;