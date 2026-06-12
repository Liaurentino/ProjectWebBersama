import { Navigate } from 'react-router-dom';

const OnboardingRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" replace />;
  if (user.isOnboarded) return <Navigate to="/dashboard" replace />;

  return children;
};

export default OnboardingRoute;