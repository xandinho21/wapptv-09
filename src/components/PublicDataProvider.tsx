
import React, { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
  type: 'wapp' | 'krator';
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
}

interface PublicDataContextType {
  publicData: PublicData;
  isLoading: boolean;
}

const PublicDataContext = createContext<PublicDataContextType | undefined>(undefined);

export const usePublicData = () => {
  const context = useContext(PublicDataContext);
  if (context === undefined) {
    throw new Error('usePublicData deve ser usado dentro de PublicDataProvider');
  }
  return context;
};

const DEFAULT_DATA = {
  contacts: ['+5519993075627', '+5519995753398'],
  resellerContacts: ['+5519993075627'],
  messages: {
    default: 'Olá! Gostaria de contratar um plano da Wapp TV. Podem me ajudar?',
    krator: 'Olá! Gostaria de contratar um plano da Wapp TV com o sistema Krator. Podem me ajudar?',
    contact: 'Olá! Gostaria de mais informações sobre a Wapp TV.',
    trial4h: 'Olá! Gostaria de solicitar um teste grátis de 4 horas da Wapp TV. Podem me ajudar?',
    trial1h: 'Olá! Gostaria de solicitar um teste grátis de 1 hora do sistema Krator. Podem me ajudar?',
    reseller: 'Olá! Gostaria de informações sobre como me tornar um revendedor da Wapp TV. Podem me ajudar?'
  },
  buttonTexts: {
    trial4h: 'Teste Grátis 4h',
    trial1h: 'Teste Grátis 1h',
    reseller: 'Quero ser um revendedor'
  },
  resellerSettings: {
    showButton: true,
    creditPrices: [
      { credits: 10, price: 'R$ 11,00' },
      { credits: 30, price: 'R$ 10,00' },
      { credits: 50, price: 'R$ 8,00' },
      { credits: 100, price: 'R$ 7,00' },
      { credits: 500, price: 'R$ 6,00' }
    ]
  },
  kratorPrice: 'R$ 25,00',
  plans: [],
  popularText: 'MAIS POPULAR',
  tutorials: { wapp: [], krator: [] }
};

export const PublicDataProvider = ({ children }: { children: React.ReactNode }) => {
  // Fetch data from the first admin user (for public display)
  const { data: adminConfig, isLoading: configLoading } = useQuery({
    queryKey: ['public-admin-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_configs' as any)
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching public admin config:', error);
        return null;
      }
      return data;
    },
  });

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['public-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans' as any)
        .select('*')
        .order('created_at');

      if (error) {
        console.error('Error fetching public plans:', error);
        return [];
      }
      return data || [];
    },
  });

  const { data: tutorials, isLoading: tutorialsLoading } = useQuery({
    queryKey: ['public-tutorials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials' as any)
        .select('*')
        .order('created_at');

      if (error) {
        console.error('Error fetching public tutorials:', error);
        return { wapp: [], krator: [] };
      }

      const wappTutorials = data?.filter((t: any) => t.type === 'wapp') || [];
      const kratorTutorials = data?.filter((t: any) => t.type === 'krator') || [];

      return {
        wapp: wappTutorials,
        krator: kratorTutorials
      };
    },
  });

  const publicData: PublicData = {
    contacts: adminConfig?.contacts || DEFAULT_DATA.contacts,
    resellerContacts: adminConfig?.reseller_contacts || DEFAULT_DATA.resellerContacts,
    messages: adminConfig?.messages || DEFAULT_DATA.messages,
    buttonTexts: adminConfig?.button_texts || DEFAULT_DATA.buttonTexts,
    resellerSettings: adminConfig?.reseller_settings || DEFAULT_DATA.resellerSettings,
    kratorPrice: adminConfig?.krator_price || DEFAULT_DATA.kratorPrice,
    plans: plans || DEFAULT_DATA.plans,
    popularText: adminConfig?.popular_text || DEFAULT_DATA.popularText,
    tutorials: tutorials || DEFAULT_DATA.tutorials,
  };

  const isLoading = configLoading || plansLoading || tutorialsLoading;

  return (
    <PublicDataContext.Provider value={{ publicData, isLoading }}>
      {children}
    </PublicDataContext.Provider>
  );
};
