
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-gray-600">
              Connecting diners and restaurants with easy, seamless reservations since 2025.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-burgundy-800">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-burgundy-800">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-burgundy-800">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">For Diners</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/search" className="text-sm text-gray-600 hover:text-burgundy-800">
                  Find a Table
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-600 hover:text-burgundy-800">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-600 hover:text-burgundy-800">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-gray-600 hover:text-burgundy-800">
                  My Reservations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">For Restaurants</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/restaurant-manager" className="text-sm text-gray-600 hover:text-burgundy-800">
                  Management Platform
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-burgundy-800">
                  Join BookTable
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-burgundy-800">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-burgundy-800">
                  Resources
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>contact@booktable.com</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; 2025 BookTable, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
