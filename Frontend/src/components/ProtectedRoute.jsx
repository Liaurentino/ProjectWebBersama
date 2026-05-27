import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Mengambil token dari localStorage sebagai penanda sesi autentikasi
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;