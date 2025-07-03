
import React from 'react';
import { useAdmin } from '../hooks/useAdmin';

const TrialSection = () => {
  const { adminData } = useAdmin();

  const handleTrialClick = () => {
    const randomContact = adminData.contacts[Math.floor(Math.random() * adminData.contacts.length)];
    const message = encodeURIComponent(adminData.messages.trial4h);
    window.open(`https://wa.me/${randomContact}?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 border border-green-400/30">
            <h3 className="text-3xl font-bold text-white mb-4">
              Experimente Antes de Comprar
            </h3>
            <p className="text-xl text-green-100 mb-6">
              Teste nossa plataforma gratuitamente por 4 horas e veja a qualidade do nosso serviço
            </p>
            <button
              onClick={handleTrialClick}
              className="bg-white hover:bg-gray-100 text-green-700 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {adminData.buttonTexts.trial4h}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrialSection;
