
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { usePublicAdmin } from '../hooks/useAdmin';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { adminData } = usePublicAdmin();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {adminData.siteLogoUrl ? (
              <img 
                src={adminData.siteLogoUrl} 
                alt={adminData.siteName} 
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-theme-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {adminData.siteName.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-2xl font-bold text-white">{adminData.siteName}</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('planos')}
              className="text-gray-300 hover:text-theme-accent transition-colors"
            >
              Planos
            </button>
            <button 
              onClick={() => scrollToSection('tutoriais')}
              className="text-gray-300 hover:text-theme-accent transition-colors"
            >
              Tutoriais
            </button>
            <button 
              onClick={() => scrollToSection('krator')}
              className="text-gray-300 hover:text-theme-accent transition-colors"
            >
              Krator
            </button>
            <button 
              onClick={() => scrollToSection('revendedor')}
              className="text-gray-300 hover:text-theme-accent transition-colors"
            >
              Seja Revendedor
            </button>
            <Link 
              to="/auth"
              className="bg-theme-secondary hover:bg-theme-accent text-white px-4 py-2 rounded-lg transition-colors"
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
              <button 
                onClick={() => scrollToSection('planos')}
                className="text-gray-300 hover:text-theme-accent transition-colors py-2 text-left"
              >
                Planos
              </button>
              <button 
                onClick={() => scrollToSection('tutoriais')}
                className="text-gray-300 hover:text-theme-accent transition-colors py-2 text-left"
              >
                Tutoriais
              </button>
              <button 
                onClick={() => scrollToSection('krator')}
                className="text-gray-300 hover:text-theme-accent transition-colors py-2 text-left"
              >
                Krator
              </button>
              <button 
                onClick={() => scrollToSection('revendedor')}
                className="text-gray-300 hover:text-theme-accent transition-colors py-2 text-left"
              >
                Seja Revendedor
              </button>
              <Link 
                to="/auth"
                className="bg-theme-secondary hover:bg-theme-accent text-white px-4 py-2 rounded-lg transition-colors inline-block text-center"
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
