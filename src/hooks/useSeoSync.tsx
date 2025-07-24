import { useEffect } from 'react';
import { usePublicDataContext } from '../contexts/PublicDataContext';

export const useSeoSync = () => {
  const { data } = usePublicDataContext();

  useEffect(() => {
    // Update document title
    if (data.seo.title) {
      document.title = data.seo.title;
    }
    
    // Update meta description
    const updateOrCreateMeta = (selector: string, content: string, attribute = 'content') => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]*)"/)![1];
          meta.setAttribute('name', name);
        } else if (selector.includes('property=')) {
          const property = selector.match(/property="([^"]*)"/)![1];
          meta.setAttribute('property', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute(attribute, content);
    };

    // Basic meta tags
    if (data.seo.description) {
      updateOrCreateMeta('meta[name="description"]', data.seo.description);
    }
    
    if (data.seo.keywords) {
      updateOrCreateMeta('meta[name="keywords"]', data.seo.keywords);
    }

    // Open Graph tags
    if (data.seo.ogTitle) {
      updateOrCreateMeta('meta[property="og:title"]', data.seo.ogTitle);
    }
    
    if (data.seo.ogDescription) {
      updateOrCreateMeta('meta[property="og:description"]', data.seo.ogDescription);
    }
    
    if (data.seo.ogImage) {
      updateOrCreateMeta('meta[property="og:image"]', data.seo.ogImage);
    }

    // Ensure og:type is set
    updateOrCreateMeta('meta[property="og:type"]', 'website');

    // Twitter Card tags
    updateOrCreateMeta('meta[name="twitter:card"]', 'summary_large_image');
    
    if (data.seo.twitterTitle) {
      updateOrCreateMeta('meta[name="twitter:title"]', data.seo.twitterTitle);
    }
    
    if (data.seo.twitterDescription) {
      updateOrCreateMeta('meta[name="twitter:description"]', data.seo.twitterDescription);
    }
    
    if (data.seo.ogImage) {
      updateOrCreateMeta('meta[name="twitter:image"]', data.seo.ogImage);
    }
    
    // Update favicon if available
    if (data.siteLogoUrl) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        link.type = 'image/x-icon';
        document.head.appendChild(link);
      }
      link.href = data.siteLogoUrl;
    }

    console.log('SEO tags updated:', {
      title: data.seo.title,
      description: data.seo.description,
      keywords: data.seo.keywords,
      ogTitle: data.seo.ogTitle,
      ogDescription: data.seo.ogDescription,
      ogImage: data.seo.ogImage,
      twitterTitle: data.seo.twitterTitle,
      twitterDescription: data.seo.twitterDescription
    });
  }, [data.seo, data.siteLogoUrl]);

  return null;
};