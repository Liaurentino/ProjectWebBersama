import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const { user, loading } = useUser();

  if (!token) return <Navigate to="/login" replace />;

  // Tunggu data user dari context selesai load
  if (loading) return null;

  // Belum onboarding → balik ke step-1
  if (!user?.isOnboarded) return <Navigate to="/onboarding/step-1" replace />;

  return children;
};

export default ProtectedRoute;