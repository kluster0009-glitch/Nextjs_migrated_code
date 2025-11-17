import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { AUTH_ENABLED } from '@/config';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Skip auth check if disabled
  if (!AUTH_ENABLED) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark cyber-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center animate-pulse">
          <span className="text-black font-bold text-xl">C</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
