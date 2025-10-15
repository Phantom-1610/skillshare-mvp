import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;



