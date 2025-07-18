import React, { createContext, useContext } from 'react';
import { usePublicData } from '../hooks/usePublicData';
import { useTheme } from '../hooks/useTheme';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  image: string;
  link: string;
}

interface PublicData {
  contacts: string[];
  resellerContacts: string[];
  messages: {
    default: string;
    krator: string;
    contact: string;
    trial4h: string;
    trial1h: string;
    reseller: string;
  };
  buttonTexts: {
    trial4h: string;
    trial1h: string;
    reseller: string;
  };
  resellerSettings: {
    showButton: boolean;
    creditPrices: {
      credits: number;
      price: string;
    }[];
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  kratorPrice: string;
  plans: Plan[];
  popularText: string;
  tutorials: {
    wapp: Tutorial[];
    krator: Tutorial[];
  };
  siteName: string;
  siteLogoUrl: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  content: {
    hero: {
      title: string;
      subtitle: string;
      buttonText: string;
      priceText: string;
      initialPrice: string;
      card1Title: string;
      card1Subtitle: string;
      card2Title: string;
      card2Subtitle: string;
      card3Title: string;
      card3Subtitle: string;
    };
    trial: {
      title: string;
      subtitle: string;
    };
    krator: {
      mainTitle: string;
      mainSubtitle: string;
      whatTitle: string;
      description: string;
      features: string[];
      performanceTitle: string;
      performanceText: string;
      stabilityTitle: string;
      stabilityText: string;
      qualityTitle: string;
      qualityText: string;
      planSectionTitle: string;
      planName: string;
      planFeatures: string[];
      trialTitle: string;
      trialDuration: string;
      trialSubtitle: string;
      trialDescription: string;
      trialFeature: string;
    };
    reseller: {
      title: string;
      subtitle: string;
      supportTitle: string;
      supportText: string;
      commissionTitle: string;
      commissionText: string;
      qualityTitle: string;
      qualityText: string;
      priceTableTitle: string;
      creditsText: string;
      perCreditText: string;
    };
    footer: {
      companyName: string;
      companyDescription: string;
      copyright: string;
      linksTitle: string;
      contactTitle: string;
      linkInicio: string;
      linkPlanos: string;
      linkKrator: string;
      linkSupport: string;
      whatsappButton: string;
      activationText: string;
      socialTitle: string;
      tagline: string;
    };
  };
}

interface PublicDataContextType {
  data: PublicData;
  loading: boolean;
  refetch: () => void;
}

const PublicDataContext = createContext<PublicDataContextType | undefined>(undefined);

export const PublicDataProvider = ({ children }: { children: React.ReactNode }) => {
  const publicDataState = usePublicData();
  
  // Initialize theme system
  useTheme();

  return (
    <PublicDataContext.Provider value={publicDataState}>
      {children}
    </PublicDataContext.Provider>
  );
};

export const usePublicDataContext = () => {
  const context = useContext(PublicDataContext);
  if (context === undefined) {
    throw new Error('usePublicDataContext must be used within a PublicDataProvider');
  }
  return context;
};
