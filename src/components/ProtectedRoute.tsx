import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, role, loading } = useAuth();

  console.log('ProtectedRoute - loading:', loading, 'user:', currentUser, 'role:', role);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-yellow-500" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (role !== 'admin') {
    console.log('User is not admin, role:', role);
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-white/70 mb-6">This area is restricted to administrators only.</p>
          <a 
            href="/" 
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  console.log('Rendering protected content');
  return <>{children}</>;
};