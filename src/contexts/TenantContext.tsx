
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  is_active: boolean;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const identifyTenant = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current domain
        const currentDomain = window.location.hostname;
        console.log('Current domain:', currentDomain);

        // Map development domains to localhost for consistency
        const domainToQuery = currentDomain === '127.0.0.1' || currentDomain.includes('localhost') 
          ? 'localhost' 
          : currentDomain;

        console.log('Querying for domain:', domainToQuery);

        // Try to find tenant by domain or subdomain
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .or(`domain.eq.${domainToQuery},subdomain.eq.${domainToQuery}`)
          .eq('is_active', true)
          .single();

        if (tenantError) {
          console.error('Error finding tenant:', tenantError);
          
          // Enhanced fallback: try to get any active tenant as last resort
          const { data: fallbackTenant, error: fallbackError } = await supabase
            .from('tenants')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single();

          if (fallbackError) {
            console.error('Error finding fallback tenant:', fallbackError);
            setError(`Nenhum tenant encontrado para o domínio: ${currentDomain}`);
            return;
          }

          console.log('Using fallback tenant:', fallbackTenant);
          setCurrentTenant(fallbackTenant);
        } else {
          console.log('Found tenant:', tenant);
          setCurrentTenant(tenant);
        }
      } catch (err) {
        console.error('Error identifying tenant:', err);
        setError('Erro ao identificar tenant');
      } finally {
        setLoading(false);
      }
    };

    identifyTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ currentTenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};
