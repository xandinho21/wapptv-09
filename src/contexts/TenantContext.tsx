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

        // Try to find tenant by domain
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .or(`domain.eq.${currentDomain},subdomain.eq.${currentDomain}`)
          .eq('is_active', true)
          .single();

        if (tenantError) {
          console.error('Error finding tenant:', tenantError);
          
          // Fallback to default tenant if no specific tenant found
          const { data: defaultTenant, error: defaultError } = await supabase
            .from('tenants')
            .select('*')
            .eq('domain', 'wapptv.top')
            .single();

          if (defaultError) {
            console.error('Error finding default tenant:', defaultError);
            setError('Tenant not found');
            return;
          }

          setCurrentTenant(defaultTenant);
        } else {
          setCurrentTenant(tenant);
        }
      } catch (err) {
        console.error('Error identifying tenant:', err);
        setError('Error identifying tenant');
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