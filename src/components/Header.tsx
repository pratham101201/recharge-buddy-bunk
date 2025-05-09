
import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudLightning, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();

  const scrollToStations = () => {
    const stationsSection = document.getElementById('stations');
    if (stationsSection) {
      stationsSection.scrollIntoView({ behavior: 'smooth' });
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
          <a href="#about" className="text-sm font-medium text-gray-600 hover:text-evblue-600 transition-colors">
            About
          </a>
          <a href="#stations" className="text-sm font-medium text-gray-600 hover:text-evblue-600 transition-colors">
            Stations
          </a>
          <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-evblue-600 transition-colors">
            Pricing
          </a>
          <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-evblue-600 transition-colors">
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>
              <span className="text-sm text-gray-600 hidden md:block">
                {currentUser.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Log out</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
          )}
          <Button 
            onClick={scrollToStations}
            className="bg-gradient-to-r from-evblue-500 to-evgreen-500 hover:from-evblue-600 hover:to-evgreen-600 text-white"
          >
            Find Stations
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
