
import React from 'react';
import { usePublicAdmin } from '../hooks/useAdmin';
import { usePublicDataContext } from '../contexts/PublicDataContext';

const TrialSection = () => {
  const { adminData } = usePublicAdmin();
  const { data: publicData } = usePublicDataContext();

  const handleTrialClick = () => {
    const randomContact = adminData.contacts[Math.floor(Math.random() * adminData.contacts.length)];
    const message = encodeURIComponent(adminData.messages.trial4h);
    window.open(`https://wa.me/${randomContact}?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-theme-primary to-theme-secondary rounded-2xl p-8 border border-theme-accent/30">
            <h3 className="text-3xl font-bold text-white mb-4">
              {publicData.content.trial.title}
            </h3>
            <p className="text-xl text-white/80 mb-6">
              {publicData.content.trial.subtitle}
            </p>
            <button
              onClick={handleTrialClick}
              className="bg-white hover:bg-gray-100 text-theme-primary font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
