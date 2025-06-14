
import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudLightning, LogOut, User, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Check if current user is admin
  const isAdmin = currentUser?.email?.includes('admin') || currentUser?.email === 'admin@evrecharge.com';

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <CloudLightning className="h-6 w-6 text-evblue-600" />
          <span className="text-xl font-bold gradient-text">EV Recharge</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-sm font-medium text-gray-600 hover:text-evblue-600 transition-colors cursor-pointer"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('stations')} 
            className="text-sm font-medium text-gray-600 hover:text-evblue-600 transition-colors cursor-pointer"
          >
            Stations
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-sm font-medium text-gray-600 hover:text-evblue-600 transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-sm font-medium text-gray-600 hover:text-evblue-600 transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>
        
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Button>
                </Link>
              )}
              
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Log out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/admin/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden md:inline">Admin</span>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
