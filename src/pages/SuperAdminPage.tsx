import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

// This page redirects to the proper sub-page based on role
const SuperAdminPage = () => {
  const role = useAppSelector(s => s.auth.user?.role);
  if (role === 'superadmin') return <Navigate to="/super-admin" replace />;
  return <Navigate to="/" replace />;
};

export default SuperAdminPage;
