
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading, isFirebaseConfigured } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Show toast only once when redirecting, not on every render
  useEffect(() => {
    if (!loading && !isFirebaseConfigured) {
      toast({
        title: "Firebase Not Configured",
        description: "Please configure Firebase to enable authentication features",
        variant: "destructive"
      });
    } else if (!loading && isFirebaseConfigured && !currentUser) {
      toast({
        title: "Access Restricted",
        description: "Please log in to view charging stations",
        variant: "destructive"
      });
    }
  }, [loading, currentUser, isFirebaseConfigured, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If Firebase is not configured, allow access but show a warning
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong>Firebase not configured:</strong> Authentication features are disabled. Configure Firebase environment variables to enable login functionality.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
