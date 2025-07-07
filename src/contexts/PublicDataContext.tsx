import React, { createContext, useContext } from 'react';
import { usePublicData } from '../hooks/usePublicData';

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
}

interface PublicDataContextType {
  data: PublicData;
  loading: boolean;
  refetch: () => void;
}

const PublicDataContext = createContext<PublicDataContextType | undefined>(undefined);

export const PublicDataProvider = ({ children }: { children: React.ReactNode }) => {
  const publicDataState = usePublicData();

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
