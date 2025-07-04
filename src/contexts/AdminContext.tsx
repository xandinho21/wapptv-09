
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdminSettings, usePlans, useTutorials, useUpdateAdminSettings, useUpdatePlans, useUpdateTutorials } from '../hooks/useSupabaseData';

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

interface AdminContextType {
  isAuthenticated: boolean;
  adminData: AdminData;
  loading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updateContacts: (contacts: string[]) => void;
  updateResellerContacts: (contacts: string[]) => void;
  updateMessages: (messages: AdminData['messages']) => void;
  updateButtonTexts: (buttonTexts: AdminData['buttonTexts']) => void;
  updateResellerSettings: (settings: AdminData['resellerSettings']) => void;
  updateKratorPrice: (price: string) => void;
  updatePlans: (plans: Plan[]) => void;
  updatePopularText: (text: string) => void;
  updateTutorials: (type: 'wapp' | 'krator', tutorials: Tutorial[]) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'admin123';

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { data: adminSettings, isLoading: adminLoading } = useAdminSettings();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: wappTutorials, isLoading: wappTutorialsLoading } = useTutorials('wapp');
  const { data: kratorTutorials, isLoading: kratorTutorialsLoading } = useTutorials('krator');
  
  const updateAdminSettingsMutation = useUpdateAdminSettings();
  const updatePlansMutation = useUpdatePlans();
  const updateTutorialsMutation = useUpdateTutorials();

  const loading = adminLoading || plansLoading || wappTutorialsLoading || kratorTutorialsLoading;

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const adminData: AdminData = {
    contacts: adminSettings?.contacts || [],
    resellerContacts: adminSettings?.reseller_contacts || [],
    messages: adminSettings?.messages || {
      default: '',
      krator: '',
      contact: '',
      trial4h: '',
      trial1h: '',
      reseller: ''
    },
    buttonTexts: adminSettings?.button_texts || {
      trial4h: '',
      trial1h: '',
      reseller: ''
    },
    resellerSettings: adminSettings?.reseller_settings || {
      showButton: true,
      creditPrices: []
    },
    kratorPrice: adminSettings?.krator_price || 'R$ 25,00',
    plans: plans?.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      period: plan.period,
      features: plan.features,
      popular: plan.popular
    })) || [],
    popularText: adminSettings?.popular_text || 'MAIS POPULAR',
    tutorials: {
      wapp: wappTutorials?.map(tutorial => ({
        id: tutorial.id,
        title: tutorial.title,
        image: tutorial.image_url || '/placeholder.svg',
        link: tutorial.link
      })) || [],
      krator: kratorTutorials?.map(tutorial => ({
        id: tutorial.id,
        title: tutorial.title,
        image: tutorial.image_url || '/placeholder.svg',
        link: tutorial.link
      })) || []
    }
  };

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const updateContacts = (contacts: string[]) => {
    updateAdminSettingsMutation.mutate({ contacts });
  };

  const updateResellerContacts = (resellerContacts: string[]) => {
    updateAdminSettingsMutation.mutate({ reseller_contacts: resellerContacts });
  };

  const updateMessages = (messages: AdminData['messages']) => {
    updateAdminSettingsMutation.mutate({ messages });
  };

  const updateButtonTexts = (buttonTexts: AdminData['buttonTexts']) => {
    updateAdminSettingsMutation.mutate({ button_texts: buttonTexts });
  };

  const updateResellerSettings = (resellerSettings: AdminData['resellerSettings']) => {
    updateAdminSettingsMutation.mutate({ reseller_settings: resellerSettings });
  };

  const updateKratorPrice = (kratorPrice: string) => {
    updateAdminSettingsMutation.mutate({ krator_price: kratorPrice });
  };

  const updatePlans = (plans: Plan[]) => {
    const plansWithOrder = plans.map((plan, index) => ({
      ...plan,
      display_order: index + 1
    }));
    updatePlansMutation.mutate(plansWithOrder);
  };

  const updatePopularText = (popularText: string) => {
    updateAdminSettingsMutation.mutate({ popular_text: popularText });
  };

  const updateTutorials = (type: 'wapp' | 'krator', tutorials: Tutorial[]) => {
    const tutorialsWithOrder = tutorials.map((tutorial, index) => ({
      id: tutorial.id,
      title: tutorial.title,
      image_url: tutorial.image,
      link: tutorial.link,
      type,
      display_order: index + 1
    }));
    updateTutorialsMutation.mutate({ type, tutorials: tutorialsWithOrder });
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      adminData,
      loading,
      login,
      logout,
      updateContacts,
      updateResellerContacts,
      updateMessages,
      updateButtonTexts,
      updateResellerSettings,
      updateKratorPrice,
      updatePlans,
      updatePopularText,
      updateTutorials
    }}>
      {children}
    </AdminContext.Provider>
  );
};
