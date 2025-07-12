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
  updateContentSettings: (section: keyof AdminData['content'], data: any) => void;
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
  },
  content: {
    hero: {
      title: 'Experimente o Melhor do Streaming',
      subtitle: 'Entretenimento de qualidade com tecnologia avançada. Desfrute de milhares de canais, filmes e séries com a melhor qualidade de streaming.',
      buttonText: 'Ver Planos',
      priceText: 'A partir de',
      initialPrice: 'R$ 25,00',
      card1Title: 'Streaming',
      card1Subtitle: 'Qualidade Premium',
      card2Title: 'Suporte',
      card2Subtitle: 'Pelo Whatsapp',
      card3Title: '15.000+',
      card3Subtitle: 'Conteúdos Disponíveis'
    },
    trial: {
      title: 'Experimente Antes de Comprar',
      subtitle: 'Teste nossa plataforma gratuitamente por 4 horas e veja a qualidade do nosso serviço'
    },
    krator: {
      mainTitle: 'Conheça o Novo Sistema Krator',
      mainSubtitle: 'Tecnologia revolucionária que transforma sua experiência de entretenimento',
      whatTitle: 'O que é o Krator?',
      description: 'O Krator é nosso sistema proprietário de streaming que garante a melhor qualidade de imagem, estabilidade de conexão e experiência de usuário incomparável. Desenvolvido especialmente para oferecer entretenimento sem interrupções.',
      features: ['Streaming em tempo real otimizado', 'Qualidade adaptativa automática', 'Cache inteligente para maior velocidade', 'Interface intuitiva e responsiva'],
      performanceTitle: 'Performance Superior',
      performanceText: 'Velocidade de carregamento 3x mais rápida comparado aos sistemas tradicionais',
      stabilityTitle: 'Estabilidade Garantida',
      stabilityText: '99.9% de uptime com servidores redundantes para máxima disponibilidade',
      qualityTitle: 'Qualidade Adaptativa',
      qualityText: 'Ajuste automático da qualidade baseado na sua conexão para melhor experiência',
      planSectionTitle: 'Plano com Sistema Krator',
      planName: 'Krator 1 Tela',
      planFeatures: ['1 Tela simultânea', 'Sistema Krator incluído', 'Alta qualidade', 'Streaming otimizado', 'Suporte via whatsapp'],
      trialTitle: 'Teste Grátis',
      trialDuration: '1 Hora',
      trialSubtitle: 'Sistema Krator',
      trialDescription: 'Experimente o sistema Krator gratuitamente e veja a diferença na qualidade do streaming.',
      trialFeature: 'Acesso completo por 1 hora'
    },
    reseller: {
      title: 'Seja um Revendedor',
      subtitle: 'Faça parte da nossa rede de revendedores e tenha uma fonte extra de renda vendendo nossos produtos com excelente suporte e comissões atrativas.',
      supportTitle: 'Suporte Completo',
      supportText: 'Oferecemos suporte técnico e comercial para você e seus clientes',
      commissionTitle: 'Comissões Atrativas',
      commissionText: 'Ganhe comissões competitivas em cada venda realizada',
      qualityTitle: 'Produtos de Qualidade',
      qualityText: 'Venda produtos testados e aprovados por milhares de clientes',
      priceTableTitle: 'Tabela de Preços para Revendedores',
      creditsText: 'créditos',
      perCreditText: 'por crédito'
    },
    footer: {
      companyName: 'Wapp TV',
      companyDescription: 'A melhor experiência em streaming com tecnologia avançada. Entretenimento de qualidade para toda a família.',
      copyright: '© 2025 Wapp TV. Todos os direitos reservados.',
      linksTitle: 'Links Úteis',
      contactTitle: 'Contato',
      linkInicio: 'Início',
      linkPlanos: 'Planos',
      linkKrator: 'Sistema Krator',
      linkSupport: 'Suporte Técnico',
      whatsappButton: 'Falar no WhatsApp',
      activationText: '⚡ Ativação imediata',
      socialTitle: 'Redes Sociais',
      tagline: 'Wapp TV - Transformando sua experiência de entretenimento'
    }
  }
};

const ADMIN_PASSWORD = 'admin123';

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};

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

  const updateContentSettings = async (section: keyof AdminData['content'], data: any) => {
    try {
      await supabaseAdmin.updateContentSettings(section, data);
      refetch(); // Refresh public data
    } catch (error) {
      console.error('Error updating content settings:', error);
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
      updateSeoImage,
      updateContentSettings
    }}>
      {children}
    </AdminContext.Provider>
  );
};
