
import { useSupabaseAdminContext } from '../contexts/SupabaseAdminContext';

export const useAdmin = () => {
  return useSupabaseAdminContext();
};
