
import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudLightning } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
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
          <Link to="/login">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              Log in
            </Button>
          </Link>
          <Button className="bg-gradient-to-r from-evblue-500 to-evgreen-500 hover:from-evblue-600 hover:to-evgreen-600 text-white">
            Find Stations
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
