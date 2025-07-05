
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-2xl font-bold text-white">Wapp TV</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#planos" className="text-gray-300 hover:text-green-400 transition-colors">
              Planos
            </a>
            <a href="#tutoriais" className="text-gray-300 hover:text-green-400 transition-colors">
              Tutoriais
            </a>
            <a href="#krator" className="text-gray-300 hover:text-green-400 transition-colors">
              Krator
            </a>
            <a href="#revendedor" className="text-gray-300 hover:text-green-400 transition-colors">
              Seja Revendedor
            </a>
            <Link 
              to="/auth"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Admin
            </Link>
          </nav>

          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4 mt-4">
              <a 
                href="#planos" 
                className="text-gray-300 hover:text-green-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Planos
              </a>
              <a 
                href="#tutoriais" 
                className="text-gray-300 hover:text-green-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tutoriais
              </a>
              <a 
                href="#krator" 
                className="text-gray-300 hover:text-green-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Krator
              </a>
              <a 
                href="#revendedor" 
                className="text-gray-300 hover:text-green-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Seja Revendedor
              </a>
              <Link 
                to="/auth"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors inline-block text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
