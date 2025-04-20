
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
}
