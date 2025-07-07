
import React from 'react';
import { usePublicAdmin } from '../hooks/useAdmin';

const Hero = () => {
  const { adminData } = usePublicAdmin();
  
  const scrollToPlans = () => {
    const element = document.getElementById('planos');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="inicio" className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center pt-16">
      <div className="container mx-auto px-4 text-center my-[31px]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Experimente o <span className="text-green-400">Melhor</span> do Streaming com{' '}
            <span className="text-green-400">{adminData.siteName}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Entretenimento de qualidade com tecnologia avançada. Desfrute de milhares de canais,
            filmes e séries com a melhor qualidade de streaming.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={scrollToPlans} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
              Ver Planos
            </button>
            
            <div className="text-gray-400">
              <span className="text-sm">A partir de</span>
              <div className="text-2xl font-bold text-green-400">R$ 25,00</div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">Streaming</div>
              <div className="text-gray-300">Qualidade Premium</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">Suporte</div>
              <div className="text-gray-300">Pelo Whatsapp</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">15.000+</div>
              <div className="text-gray-300">Conteúdos Disponíveis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
