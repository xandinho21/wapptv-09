
import React from 'react';
import { Users, DollarSign, Star, ArrowRight } from 'lucide-react';
import { usePublicAdmin } from '../hooks/useAdmin';
import { usePublicDataContext } from '../contexts/PublicDataContext';

const ResellerSection = () => {
  const { adminData } = usePublicAdmin();
  const { data: publicData } = usePublicDataContext();

  const openWhatsApp = () => {
    const message = encodeURIComponent(adminData.messages.reseller);
    const phoneNumber = adminData.resellerContacts[0]?.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!adminData.resellerSettings.showButton) {
    return null;
  }

  return (
    <section id="revendedor" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {publicData.content.reseller.title} {adminData.siteName}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {publicData.content.reseller.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{publicData.content.reseller.supportTitle}</h3>
            <p className="text-gray-300">
              {publicData.content.reseller.supportText}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{publicData.content.reseller.commissionTitle}</h3>
            <p className="text-gray-300">
              {publicData.content.reseller.commissionText}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{publicData.content.reseller.qualityTitle}</h3>
            <p className="text-gray-300">
              {publicData.content.reseller.qualityText}
            </p>
          </div>
        </div>

        {adminData.resellerSettings.creditPrices.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {publicData.content.reseller.priceTableTitle}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminData.resellerSettings.creditPrices.map((item, index) => (
                 <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                   <div className="text-3xl font-bold text-theme-primary mb-2">
                     {item.credits}
                   </div>
                  <div className="text-gray-300 mb-2">créditos</div>
                  <div className="text-xl font-semibold text-white">
                    {item.price}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    por crédito
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={openWhatsApp}
            className="bg-theme-primary hover:bg-theme-secondary text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center gap-2"
          >
            {adminData.buttonTexts.reseller}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResellerSection;
