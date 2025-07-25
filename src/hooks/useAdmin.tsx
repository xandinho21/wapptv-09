
import { useContext } from 'react';
import { SecureAdminContext } from '../contexts/SecureAdminContext';
import { usePublicDataContext } from '../contexts/PublicDataContext';

export const useAdmin = () => {
  const context = useContext(SecureAdminContext);
  if (context === undefined) {
    throw new Error('useAdmin deve ser usado dentro de SecureAdminProvider');
  }
  return context;
};

// Hook for public data access (used in landing page components)
export const usePublicAdmin = () => {
  const { data } = usePublicDataContext();
  return { adminData: data };
};
