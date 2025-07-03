
import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';

const ResellerSection = () => {
  const { adminData } = useAdmin();
  const [showCreditPrices, setShowCreditPrices] = useState(false);

  const handleResellerButtonClick = () => {
    setShowCreditPrices(!showCreditPrices);
  };

  const handleCreditPurchase = (credits: number) => {
    const randomContact = adminData.resellerContacts[Math.floor(Math.random() * adminData.resellerContacts.length)];
    const message = encodeURIComponent(`${adminData.messages.reseller} Gostaria de comprar ${credits} créditos.`);
    window.open(`https://wa.me/${randomContact}?text=${message}`, '_blank');
  };

  if (!adminData.resellerSettings.showButton) {
    return null;
  }

  return (
    <section id="revenda" className="py-12 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <button
            onClick={handleResellerButtonClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {adminData.buttonTexts.reseller}
          </button>

          {showCreditPrices && (
            <div className="mt-8 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 border border-green-400/30">
              <h3 className="text-3xl font-bold text-white mb-4">
                Tabela de Créditos para Revenda
              </h3>
              <p className="text-green-100 mb-6">
                Valores dos créditos do servidor <strong>Wplay</strong>. Observe que quanto maior a quantidade de créditos comprados, 
                menor o valor do investimento por crédito, e, consequentemente, maior seu lucro na venda!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {adminData.resellerSettings.creditPrices.map((item, index) => (
                  <div key={index} className="bg-green-700/50 backdrop-blur-sm rounded-xl p-6 border border-green-400/30 transition-all duration-300 hover:scale-105">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-white mb-2">{item.credits} Créditos</div>
                      <div className="text-xl font-bold text-green-200">{item.price}</div>
                      <div className="text-green-300 text-sm">por crédito</div>
                    </div>
                    
                    <button 
                      onClick={() => handleCreditPurchase(item.credits)}
                      className="w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 bg-green-300 hover:bg-green-200 text-green-900 shadow-lg hover:shadow-green-300/25"
                    >
                      Comprar {item.credits} Créditos
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResellerSection;
