import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseAdmin } from '../hooks/useSupabaseAdmin';
import { usePublicDataContext } from './PublicDataContext';

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

interface AdminContextType {
  isAuthenticated: boolean;
  adminData: AdminData;
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
  updateSiteName: (name: string) => void;
  updateSiteLogo: (file: File) => Promise<string>;
  updateSeoSettings: (seoData: AdminData['seo']) => void;
  updateSeoImage: (file: File) => Promise<string>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

const DEFAULT_ADMIN_DATA: AdminData = {
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
  plans: [
    {
      id: '1',
      name: 'Plano 1 Tela',
      price: 'R$ 25,00',
      period: 'por mês',
      features: [
        '1 Tela simultânea',
        'Alta qualidade',
        'Todos os canais',
        'Filmes e séries',
        'Suporte via whatsapp'
      ],
      popular: false
    },
    {
      id: '2',
      name: 'Plano 2 Telas',
      price: 'R$ 35,00',
      period: 'por mês',
      features: [
        '2 Telas simultâneas',
        'Alta qualidade',
        'Todos os canais',
        'Filmes e séries',
        'Suporte via whatsapp'
      ],
      popular: true
    },
    {
      id: '3',
      name: 'Plano 3 Telas',
      price: 'R$ 45,00',
      period: 'por mês',
      features: [
        '3 Telas simultâneas',
        'Alta qualidade',
        'Todos os canais',
        'Filmes e séries',
        'Suporte via whatsapp'
      ],
      popular: false
    }
  ],
  popularText: 'MAIS POPULAR',
  tutorials: {
    wapp: [
      {
        id: '1',
        title: 'Como configurar sua TV',
        image: '/placeholder.svg',
        link: 'https://example.com/tutorial1'
      },
      {
        id: '2',
        title: 'Instalação do aplicativo',
        image: '/placeholder.svg',
        link: 'https://example.com/tutorial2'
      }
    ],
    krator: [
      {
        id: '1',
        title: 'Setup inicial Krator',
        image: '/placeholder.svg',
        link: 'https://example.com/krator1'
      }
    ]
  },
  siteName: 'Wapp TV',
  siteLogoUrl: '',
  seo: {
    title: 'Wapp TV - O Melhor da IPTV',
    description: 'Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator. Teste grátis disponível!',
    keywords: 'IPTV, Wapp TV, Krator, streaming, televisão online, planos IPTV, teste grátis',
    ogTitle: 'Wapp TV - O Melhor da IPTV',
    ogDescription: 'Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator.',
    ogImage: '',
    twitterTitle: 'Wapp TV - O Melhor da IPTV',
    twitterDescription: 'Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator.'
  }
};

const ADMIN_PASSWORD = 'admin123';

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: publicData, refetch } = usePublicDataContext();
  const supabaseAdmin = useSupabaseAdmin();

  // Use public data as admin data since it's the same data
  const adminData = publicData;

  useEffect(() => {
    // Check authentication from localStorage
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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

  const updateContacts = async (contacts: string[]) => {
    try {
      await supabaseAdmin.updateContacts(contacts);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating contacts:', error);
    }
  };

  const updateResellerContacts = async (contacts: string[]) => {
    try {
      await supabaseAdmin.updateResellerContacts(contacts);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating reseller contacts:', error);
    }
  };

  const updateMessages = async (messages: AdminData['messages']) => {
    try {
      await supabaseAdmin.updateMessages(messages);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating messages:', error);
    }
  };

  const updateButtonTexts = async (buttonTexts: AdminData['buttonTexts']) => {
    try {
      await supabaseAdmin.updateButtonTexts(buttonTexts);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating button texts:', error);
    }
  };

  const updateResellerSettings = async (resellerSettings: AdminData['resellerSettings']) => {
    try {
      await supabaseAdmin.updateResellerSettings(resellerSettings);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating reseller settings:', error);
    }
  };

  const updateKratorPrice = async (kratorPrice: string) => {
    try {
      await supabaseAdmin.updateKratorPrice(kratorPrice);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating krator price:', error);
    }
  };

  const updatePlans = async (plans: Plan[]) => {
    try {
      await supabaseAdmin.updatePlans(plans);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating plans:', error);
    }
  };

  const updatePopularText = async (popularText: string) => {
    try {
      await supabaseAdmin.updatePopularText(popularText);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating popular text:', error);
    }
  };

  const updateTutorials = async (type: 'wapp' | 'krator', tutorials: Tutorial[]) => {
    try {
      await supabaseAdmin.updateTutorials(type, tutorials);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating tutorials:', error);
    }
  };

  const updateSiteName = async (siteName: string) => {
    try {
      await supabaseAdmin.updateSiteName(siteName);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating site name:', error);
    }
  };

  const updateSiteLogo = async (file: File): Promise<string> => {
    try {
      const logoUrl = await supabaseAdmin.updateSiteLogo(file);
      refetch(); // Refresh public data
      return logoUrl;
    } catch (error) {
      console.error('Error updating site logo:', error);
      throw error;
    }
  };

  const updateSeoSettings = async (seoData: AdminData['seo']) => {
    try {
      await supabaseAdmin.updateSeoSettings(seoData);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating SEO settings:', error);
    }
  };

  const updateSeoImage = async (file: File): Promise<string> => {
    try {
      const imageUrl = await supabaseAdmin.updateSeoImage(file);
      refetch(); // Refresh public data
      return imageUrl;
    } catch (error) {
      console.error('Error updating SEO image:', error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      adminData,
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
      updateTutorials,
      updateSiteName,
      updateSiteLogo,
      updateSeoSettings,
      updateSeoImage
    }}>
      {children}
    </AdminContext.Provider>
  );
};
