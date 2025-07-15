import React from 'react';
import { usePublicAdmin } from '../hooks/useAdmin';
import { usePublicDataContext } from '../contexts/PublicDataContext';
const Krator = () => {
  const {
    adminData
  } = usePublicAdmin();
  const {
    data: publicData
  } = usePublicDataContext();
  const handleBuyClick = () => {
    const randomContact = adminData.contacts[Math.floor(Math.random() * adminData.contacts.length)];
    const message = encodeURIComponent(adminData.messages.krator);
    window.open(`https://wa.me/${randomContact}?text=${message}`, '_blank');
  };
  const handleTrialClick = () => {
    const randomContact = adminData.contacts[Math.floor(Math.random() * adminData.contacts.length)];
    const message = encodeURIComponent(adminData.messages.trial1h);
    window.open(`https://wa.me/${randomContact}?text=${message}`, '_blank');
  };
  const kratorPlan = {
    name: 'Krator 1 Tela',
    price: adminData.kratorPrice,
    features: ['1 Tela simultânea', 'Sistema Krator incluído', 'Alta qualidade', 'Streaming otimizado', 'Suporte via whatsapp']
  };
  return <section id="krator" className="py-20" style={{ background: `linear-gradient(135deg, hsl(var(--krator-primary) / 0.8), hsl(var(--krator-secondary) / 0.9), hsl(217.2 32.6% 17.5%))` }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {publicData.content.krator.mainTitle} 
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {publicData.content.krator.mainSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-krator-primary/30">
                <h3 className="text-3xl font-bold text-white mb-6">{publicData.content.krator.whatTitle}</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {publicData.content.krator.description}
                </p>
                
                <div className="space-y-4">
                  {['Streaming em tempo real otimizado', 'Qualidade adaptativa automática', 'Cache inteligente para maior velocidade', 'Interface intuitiva e responsiva'].map((feature, index) => <div key={index} className="flex items-center">
                      <div className="w-3 h-3 bg-krator-primary rounded-full mr-4"></div>
                      <span className="text-gray-300 text-base">{feature}</span>
                    </div>)}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-krator-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-krator-primary/20">
                <h4 className="text-xl font-bold text-white mb-3">Performance Superior</h4>
                <p className="text-gray-300">
                  Velocidade de carregamento 3x mais rápida comparado aos sistemas tradicionais
                </p>
              </div>

              <div className="bg-krator-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-krator-primary/20">
                <h4 className="text-xl font-bold text-white mb-3">Estabilidade Garantida</h4>
                <p className="text-gray-300">
                  99.9% de uptime com servidores redundantes para máxima disponibilidade
                </p>
              </div>

              <div className="bg-krator-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-krator-primary/20">
                <h4 className="text-xl font-bold text-white mb-3">Qualidade Adaptativa</h4>
                <p className="text-gray-300">
                  Ajuste automático da qualidade baseado na sua conexão para melhor experiência
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="rounded-2xl p-8 border border-krator-primary/30" style={{ background: `linear-gradient(135deg, hsl(var(--krator-primary) / 0.6), hsl(var(--krator-secondary) / 0.8))` }}>
              <h3 className="text-3xl font-bold text-white mb-8">
                Plano com Sistema Krator
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Plano Krator */}
                <div className="bg-krator-secondary/50 backdrop-blur-sm rounded-xl p-6 border-2 border-krator-primary shadow-xl transition-all duration-300 hover:scale-105 relative" style={{ boxShadow: `0 25px 50px -12px hsl(var(--krator-primary) / 0.2)` }}>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-krator-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    DISPONÍVEL
                  </div>

                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-white mb-2">{kratorPlan.name}</h4>
                    <div className="text-3xl font-bold text-krator-primary mb-2">{kratorPlan.price}</div>
                    <div className="text-gray-200">por mês</div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {kratorPlan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center text-gray-100">
                        <div className="w-2 h-2 bg-krator-primary rounded-full mr-3"></div>
                        {feature}
                      </li>)}
                  </ul>

                  <button onClick={handleBuyClick} className="w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 bg-krator-primary hover:bg-krator-primary/80 text-white shadow-lg" style={{ boxShadow: `0 10px 25px -5px hsl(var(--krator-primary) / 0.25)` }}>
                    Comprar
                  </button>
                </div>

                {/* Teste Grátis */}
                <div className="bg-krator-secondary/50 backdrop-blur-sm rounded-xl p-6 border-2 border-krator-primary/50 shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-white mb-4">Teste Grátis</h4>
                    <div className="text-3xl font-bold text-krator-primary mb-2">1 Hora</div>
                    <div className="text-gray-200">Sistema Krator</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="text-center text-gray-100">
                      <p className="mb-4">Experimente o sistema Krator gratuitamente e veja a diferença na qualidade do streaming.</p>
                      <div className="flex items-center justify-center">
                        <div className="w-2 h-2 bg-krator-primary rounded-full mr-3"></div>
                        <span>Acesso completo por 1 hora</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleTrialClick} 
                    className="w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
                    style={{ 
                      backgroundColor: `hsl(var(--krator-trial-button-bg))`,
                      color: `hsl(var(--krator-trial-button-text))`,
                      boxShadow: `0 10px 25px -5px hsl(var(--krator-trial-button-bg) / 0.25)`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `hsl(var(--krator-trial-button-hover))`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `hsl(var(--krator-trial-button-bg))`;
                    }}
                  >
                    {adminData.buttonTexts.trial1h}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Krator;