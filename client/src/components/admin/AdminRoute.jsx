import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;