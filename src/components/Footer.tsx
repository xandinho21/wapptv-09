import React from 'react';
import { useAdmin } from '../hooks/useAdmin';

const Footer = () => {
  const { adminData } = useAdmin();

  const handleContactClick = () => {
    const randomContact = adminData.contacts[Math.floor(Math.random() * adminData.contacts.length)];
    const message = encodeURIComponent(adminData.messages.contact);
    window.open(`https://wa.me/${randomContact}?text=${message}`, '_blank');
  };

  return <footer id="contato" className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-6">Wapp TV</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">A melhor experiência em streaming com tecnologia avançada.
Entretenimento de qualidade para toda a família.</p>
            <div className="text-sm text-gray-400">© 2025 Wapp TV. Todos os direitos reservados.</div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Links Úteis</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => document.getElementById('inicio')?.scrollIntoView({
                behavior: 'smooth'
              })} className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('planos')?.scrollIntoView({
                behavior: 'smooth'
              })} className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  Planos
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('krator')?.scrollIntoView({
                behavior: 'smooth'
              })} className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  Sistema Krator
                </button>
              </li>
              <li>
                <button onClick={handleContactClick} className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  Suporte Técnico
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">Contato</h4>
            <div className="space-y-4">
              <button onClick={handleContactClick} className="block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                Falar no WhatsApp
              </button>
              
              <div className="text-gray-300">
                
                
                <p>⚡ Ativação imediata</p>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-lg font-bold text-white mb-3">Redes Sociais</h5>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                  <span className="text-white font-bold">F</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                  <span className="text-white font-bold">I</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                  <span className="text-white font-bold">Y</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            Wapp TV - Transformando sua experiência de entretenimento
          </p>
        </div>
      </div>
    </footer>;
};

export default Footer;
