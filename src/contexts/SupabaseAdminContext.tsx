
import React, { createContext, useContext } from 'react';
import { useSupabaseAdmin } from '../hooks/useSupabaseAdmin';

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

interface AdminData {
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

interface SupabaseAdminContextType {
  adminData: AdminData;
  updateContacts: (contacts: string[]) => void;
  updateResellerContacts: (contacts: string[]) => void;
  updateMessages: (messages: AdminData['messages']) => void;
  updateButtonTexts: (buttonTexts: AdminData['buttonTexts']) => void;
  updateResellerSettings: (settings: AdminData['resellerSettings']) => void;
  updateKratorPrice: (price: string) => void;
  updatePlans: (plans: Plan[]) => void;
  updatePopularText: (text: string) => void;
  updateTutorials: (type: 'wapp' | 'krator', tutorials: Tutorial[]) => void;
  isLoading: boolean;
}

const SupabaseAdminContext = createContext<SupabaseAdminContextType | undefined>(undefined);

export const useSupabaseAdminContext = () => {
  const context = useContext(SupabaseAdminContext);
  if (context === undefined) {
    throw new Error('useSupabaseAdminContext deve ser usado dentro de SupabaseAdminProvider');
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

export const SupabaseAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const supabaseAdmin = useSupabaseAdmin();

  const adminData: AdminData = {
    contacts: supabaseAdmin.adminConfig?.contacts || DEFAULT_DATA.contacts,
    resellerContacts: supabaseAdmin.adminConfig?.reseller_contacts || DEFAULT_DATA.resellerContacts,
    messages: supabaseAdmin.adminConfig?.messages || DEFAULT_DATA.messages,
    buttonTexts: supabaseAdmin.adminConfig?.button_texts || DEFAULT_DATA.buttonTexts,
    resellerSettings: supabaseAdmin.adminConfig?.reseller_settings || DEFAULT_DATA.resellerSettings,
    kratorPrice: supabaseAdmin.adminConfig?.krator_price || DEFAULT_DATA.kratorPrice,
    plans: supabaseAdmin.plans || DEFAULT_DATA.plans,
    popularText: supabaseAdmin.adminConfig?.popular_text || DEFAULT_DATA.popularText,
    tutorials: supabaseAdmin.tutorials || DEFAULT_DATA.tutorials,
  };

  return (
    <SupabaseAdminContext.Provider value={{
      adminData,
      updateContacts: supabaseAdmin.updateContacts,
      updateResellerContacts: supabaseAdmin.updateResellerContacts,
      updateMessages: supabaseAdmin.updateMessages,
      updateButtonTexts: supabaseAdmin.updateButtonTexts,
      updateResellerSettings: supabaseAdmin.updateResellerSettings,
      updateKratorPrice: supabaseAdmin.updateKratorPrice,
      updatePlans: supabaseAdmin.updatePlans,
      updatePopularText: supabaseAdmin.updatePopularText,
      updateTutorials: supabaseAdmin.updateTutorials,
      isLoading: supabaseAdmin.isLoading,
    }}>
      {children}
    </SupabaseAdminContext.Provider>
  );
};
