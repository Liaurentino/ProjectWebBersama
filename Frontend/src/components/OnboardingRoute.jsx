import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const OnboardingRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const { user, loading } = useUser();
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  // Tunggu data user dari context selesai load
  if (loading) return null;

  // Sudah selesai onboarding → ke dashboard
  if (user?.isOnboarded) return <Navigate to="/dashboard" replace />;

  // Belum isi step-1 (jurusan) tapi coba akses step-2 → balik ke step-1
  if (!user?.jurusan && location.pathname === '/onboarding/step-2') {
    return <Navigate to="/onboarding/step-1" replace />;
  }

  // Sudah isi step-1 (jurusan) tapi masih di step-1 → lanjut ke step-2
  // Kecuali user sengaja klik tombol Back dari step-2 (ditandai state.intentional)
  if (
    user?.jurusan &&
    location.pathname === '/onboarding/step-1' &&
    !location.state?.intentional
  ) {
    return <Navigate to="/onboarding/step-2" replace />;
  }

  return children;
};

export default OnboardingRoute;