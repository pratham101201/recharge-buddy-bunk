import React from 'react';
import { CloudLightning } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CloudLightning className="h-6 w-6 text-evblue-400" />
              <span className="text-xl font-bold text-white">EV Recharge</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Powering sustainable transportation with innovative EV charging solutions.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-sm hover:text-evblue-300 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#stations" className="text-sm hover:text-evblue-300 transition-colors">
                  Find Stations
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm hover:text-evblue-300 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  Download App
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm hover:text-evblue-300 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  EV News
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  Partners
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-evblue-300 transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} EV Recharge. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-white">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
