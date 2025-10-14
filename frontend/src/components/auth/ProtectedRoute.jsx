import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
