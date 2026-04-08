import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { UserRole } from '@/store/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector(s => s.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'superadmin' ? '/super-admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
