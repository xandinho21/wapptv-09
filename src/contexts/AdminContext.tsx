import React, { createContext, useContext, useState, useEffect } from 'react';

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
  imageUrl: string;
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
  tutorials: Tutorial[];
  kratorTutorials: Tutorial[];
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
  updateTutorials: (tutorials: Tutorial[]) => void;
  updateKratorTutorials: (tutorials: Tutorial[]) => void;
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
  tutorials: [
    {
      id: '1',
      title: 'Como instalar no Smart TV',
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
      link: 'https://example.com/tutorial1'
    },
    {
      id: '2',
      title: 'Configuração no Android',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
      link: 'https://example.com/tutorial2'
    },
    {
      id: '3',
      title: 'Setup no iOS',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
      link: 'https://example.com/tutorial3'
    },
    {
      id: '4',
      title: 'Configuração no PC',
      imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=400&fit=crop',
      link: 'https://example.com/tutorial4'
    }
  ],
  kratorTutorials: [
    {
      id: '1',
      title: 'Instalação do Sistema Krator',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
      link: 'https://example.com/krator-tutorial1'
    },
    {
      id: '2',
      title: 'Configuração Avançada',
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
      link: 'https://example.com/krator-tutorial2'
    }
  ]
};

const ADMIN_PASSWORD = 'admin123';

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<AdminData>(DEFAULT_ADMIN_DATA);

  useEffect(() => {
    // Carregar dados do localStorage
    const storedAuth = localStorage.getItem('adminAuth');
    const storedData = localStorage.getItem('adminData');
    
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    if (storedData) {
      try {
        setAdminData(JSON.parse(storedData));
      } catch (error) {
        console.error('Erro ao carregar dados admin:', error);
      }
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

  const updateContacts = (contacts: string[]) => {
    const newData = { ...adminData, contacts };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updateResellerContacts = (resellerContacts: string[]) => {
    const newData = { ...adminData, resellerContacts };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updateMessages = (messages: AdminData['messages']) => {
    const newData = { ...adminData, messages };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updateButtonTexts = (buttonTexts: AdminData['buttonTexts']) => {
    const newData = { ...adminData, buttonTexts };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updateResellerSettings = (resellerSettings: AdminData['resellerSettings']) => {
    const newData = { ...adminData, resellerSettings };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updateKratorPrice = (kratorPrice: string) => {
    const newData = { ...adminData, kratorPrice };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updatePlans = (plans: Plan[]) => {
    const newData = { ...adminData, plans };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updatePopularText = (popularText: string) => {
    const newData = { ...adminData, popularText };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updateTutorials = (tutorials: Tutorial[]) => {
    const newData = { ...adminData, tutorials };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  const updateKratorTutorials = (tutorials: Tutorial[]) => {
    const newData = { ...adminData, kratorTutorials: tutorials };
    setAdminData(newData);
    localStorage.setItem('adminData', JSON.stringify(newData));
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
      updateKratorTutorials
    }}>
      {children}
    </AdminContext.Provider>
  );
};
