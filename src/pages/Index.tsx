
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Plans from '../components/Plans';
import TrialSection from '../components/TrialSection';
import Krator from '../components/Krator';
import ResellerSection from '../components/ResellerSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero />
      <Plans />
      <TrialSection />
      <Krator />
      <ResellerSection />
      <Footer />
    </div>
  );
};

export default Index;
