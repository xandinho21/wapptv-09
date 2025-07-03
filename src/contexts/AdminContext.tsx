
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  }
};

const ADMIN_PASSWORD = 'admin123'; // Em produção, isso deveria vir de um backend seguro

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
      updateResellerSettings
    }}>
      {children}
    </AdminContext.Provider>
  );
};
