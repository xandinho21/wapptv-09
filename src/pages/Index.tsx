import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Plans from '../components/Plans';
import TrialSection from '../components/TrialSection';
import Krator from '../components/Krator';
import ResellerSection from '../components/ResellerSection';
import Footer from '../components/Footer';
import Tutorials from '../components/Tutorials';
import { usePublicDataContext } from '../contexts/PublicDataContext';

const Index = () => {
  const { data } = usePublicDataContext();

  useEffect(() => {
    // Update document title
    document.title = `${data.siteName} - O Melhor da IPTV`;
    
    // Update favicon if logo is available
    if (data.siteLogoUrl) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = data.siteLogoUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [data.siteName, data.siteLogoUrl]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero />
      <Plans />
      <TrialSection />
      <Tutorials type="wapp" />
      <Krator />
      <Tutorials type="krator" />
      <ResellerSection />
      <Footer />
    </div>
  );
};

export default Index;
