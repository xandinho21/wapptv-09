import React from 'react';
import { usePublicAdmin } from '../hooks/useAdmin';
import { usePublicDataContext } from '../contexts/PublicDataContext';

const Footer = () => {
  const { adminData } = usePublicAdmin();
  const { data: publicData } = usePublicDataContext();

  console.log('Footer - adminData.socialLinks:', adminData.socialLinks);

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
            <h3 className="text-2xl font-bold text-green-400 mb-6">{adminData.siteName}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{publicData.content.footer.companyDescription}</p>
            <div className="text-sm text-gray-400">{publicData.content.footer.copyright}</div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">{publicData.content.footer.linksTitle}</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => document.getElementById('inicio')?.scrollIntoView({
                behavior: 'smooth'
              })} className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {publicData.content.footer.linkInicio}
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('planos')?.scrollIntoView({
                behavior: 'smooth'
              })} className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {publicData.content.footer.linkPlanos}
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('krator')?.scrollIntoView({
                behavior: 'smooth'
              })} className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {publicData.content.footer.linkKrator}
                </button>
              </li>
              <li>
                <button onClick={handleContactClick} className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {publicData.content.footer.linkSupport}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6">{publicData.content.footer.contactTitle}</h4>
            <div className="space-y-4">
              <button onClick={handleContactClick} className="block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                {publicData.content.footer.whatsappButton}
              </button>
              
              <div className="text-gray-300">
                
                
                <p>{publicData.content.footer.activationText}</p>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-lg font-bold text-white mb-3">{publicData.content.footer.socialTitle}</h5>
              <div className="flex space-x-4">
                {adminData.socialLinks?.facebook && (
                  <a href={adminData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                    <span className="text-white font-bold">F</span>
                  </a>
                )}
                {adminData.socialLinks?.instagram && (
                  <a href={adminData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                    <span className="text-white font-bold">I</span>
                  </a>
                )}
                {adminData.socialLinks?.youtube && (
                  <a href={adminData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                    <span className="text-white font-bold">Y</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            {publicData.content.footer.tagline}
          </p>
        </div>
      </div>
    </footer>;
};

export default Footer;
