
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { auth } from '@/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  loading: true,
  logout: async () => {} 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Logout function
  const logout = async () => {
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    loading,
    logout
  }), [currentUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
