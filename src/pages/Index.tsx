
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Plans from '../components/Plans';
import TrialSection from '../components/TrialSection';
import Tutorials from '../components/Tutorials';
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
      <Tutorials variant="green" type="wapp" />
      <Krator />
      <Tutorials variant="purple" type="krator" />
      <ResellerSection />
      <Footer />
    </div>
  );
};

export default Index;
