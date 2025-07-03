
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-green-400">Wapp TV</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-300 hover:text-green-400 transition-colors duration-200"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('planos')}
              className="text-gray-300 hover:text-green-400 transition-colors duration-200"
            >
              Planos
            </button>
            <button
              onClick={() => scrollToSection('krator')}
              className="text-gray-300 hover:text-green-400 transition-colors duration-200"
            >
              Krator
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className="text-gray-300 hover:text-green-400 transition-colors duration-200"
            >
              Contato
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-green-400 transition-colors duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <nav className="flex flex-col py-4 space-y-2">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-left px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700 transition-colors duration-200"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('planos')}
                className="text-left px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700 transition-colors duration-200"
              >
                Planos
              </button>
              <button
                onClick={() => scrollToSection('krator')}
                className="text-left px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700 transition-colors duration-200"
              >
                Krator
              </button>
              <button
                onClick={() => scrollToSection('contato')}
                className="text-left px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-700 transition-colors duration-200"
              >
                Contato
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
