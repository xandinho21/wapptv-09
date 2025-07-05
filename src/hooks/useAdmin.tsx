
import { useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';
import { usePublicDataContext } from '../contexts/PublicDataContext';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin deve ser usado dentro de AdminProvider');
  }
  return context;
};

// Hook for public data access (used in landing page components)
export const usePublicAdmin = () => {
  const { data } = usePublicDataContext();
  return { adminData: data };
};
