import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isTokenExpired } = useAuthStore();

  if (!isAuthenticated || isTokenExpired()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}