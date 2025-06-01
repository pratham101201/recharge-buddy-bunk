
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Show toast only once when redirecting, not on every render
  useEffect(() => {
    if (!loading && !currentUser) {
      toast({
        title: "Access Restricted",
        description: "Please log in to view charging stations",
        variant: "destructive"
      });
    }
  }, [loading, currentUser, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
