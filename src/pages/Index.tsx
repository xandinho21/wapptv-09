
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
    // Update document title with SEO title
    document.title = data.seo.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', data.seo.description);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', data.seo.keywords);

    // Update Open Graph tags
    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMetaProperty('og:title', data.seo.ogTitle);
    updateMetaProperty('og:description', data.seo.ogDescription);
    updateMetaProperty('og:type', 'website');
    if (data.seo.ogImage) {
      updateMetaProperty('og:image', data.seo.ogImage);
    }

    // Update Twitter Card tags
    const updateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateTwitterMeta('twitter:card', 'summary_large_image');
    updateTwitterMeta('twitter:title', data.seo.twitterTitle);
    updateTwitterMeta('twitter:description', data.seo.twitterDescription);
    if (data.seo.ogImage) {
      updateTwitterMeta('twitter:image', data.seo.ogImage);
    }
    
    // Update favicon if logo is available
    if (data.siteLogoUrl) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = data.siteLogoUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [data]);

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
