
import React from 'react';
import { usePublicAdmin } from '../hooks/useAdmin';

const Plans = () => {
  const { adminData } = usePublicAdmin();

  const handleBuyClick = () => {
    const randomContact = adminData.contacts[Math.floor(Math.random() * adminData.contacts.length)];
    const message = encodeURIComponent(adminData.messages.default);
    window.open(`https://wa.me/${randomContact}?text=${message}`, '_blank');
  };

  return (
    <section id="planos" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Escolha Seu <span className="text-theme-accent">Plano</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Planos flexíveis para atender suas necessidades. Todos com acesso completo ao nosso catálogo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminData.plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gray-800 rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'border-theme-accent shadow-2xl shadow-theme-accent/20'
                  : 'border-gray-700 hover:border-theme-accent/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-theme-accent text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  {adminData.popularText}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-theme-accent mb-2">{plan.price}</div>
                <div className="text-gray-400">{plan.period}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-theme-accent rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleBuyClick}
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-theme-accent hover:bg-theme-secondary text-gray-900 shadow-lg'
                    : 'bg-gray-700 hover:bg-theme-accent text-white hover:text-gray-900'
                }`}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
