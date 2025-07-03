
import { useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin deve ser usado dentro de AdminProvider');
  }
  return context;
};
