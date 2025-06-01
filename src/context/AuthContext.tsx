
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { auth } from '@/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isFirebaseConfigured: boolean;
};

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  loading: true,
  logout: async () => {},
  isFirebaseConfigured: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if Firebase is properly configured
  useEffect(() => {
    const hasFirebaseConfig = !!(
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    );
    
    setIsFirebaseConfigured(hasFirebaseConfig);
    
    if (!hasFirebaseConfig) {
      console.warn('Firebase not configured - authentication features will be limited');
      setLoading(false);
      return;
    }
  }, []);

  // Logout function
  const logout = async () => {
    if (!auth || !isFirebaseConfigured) {
      toast({
        title: "Error",
        description: "Firebase not configured",
        variant: "destructive"
      });
      return;
    }

    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseConfigured]);

  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    loading,
    logout,
    isFirebaseConfigured
  }), [currentUser, loading, isFirebaseConfigured]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
