
import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from './TenantContext';

interface PublicData {
  siteName: string;
  siteLogoUrl: string;
  popularText: string;
  kratorPrice: string;
  plans: any[];
  wappTutorials: any[];
  kratorTutorials: any[];
  contacts: string[];
  resellerContacts: string[];
  messages: Record<string, string>;
  buttonTexts: Record<string, string>;
  resellerSettings: {
    showButton: boolean;
    creditPrices: { credits: number; price: string; }[];
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  seoSettings: {
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

interface PublicDataContextType {
  data: PublicData;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const PublicDataContext = createContext<PublicDataContextType | undefined>(undefined);

export const usePublicDataContext = () => {
  const context = useContext(PublicDataContext);
  if (context === undefined) {
    throw new Error('usePublicDataContext deve ser usado dentro de PublicDataProvider');
  }
  return context;
};

export const PublicDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentTenant, loading: tenantLoading } = useTenant();

  const { data: publicData, isLoading, error, refetch } = useQuery({
    queryKey: ['publicData', currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant) {
        throw new Error('No tenant found');
      }

      console.log('Fetching public data for tenant:', currentTenant.id);

      // Fetch all data in parallel
      const [
        adminSettingsResult,
        plansResult,
        tutorialsResult,
        contactsResult,
        messagesResult,
        buttonTextsResult,
        resellerSettingsResult
      ] = await Promise.all([
        supabase.from('admin_settings').select('*').eq('tenant_id', currentTenant.id),
        supabase.from('plans').select('*').eq('tenant_id', currentTenant.id).order('sort_order'),
        supabase.from('tutorials').select('*').eq('tenant_id', currentTenant.id).order('sort_order'),
        supabase.from('contacts').select('*').eq('tenant_id', currentTenant.id),
        supabase.from('messages').select('*').eq('tenant_id', currentTenant.id),
        supabase.from('button_texts').select('*').eq('tenant_id', currentTenant.id),
        supabase.from('reseller_settings').select('*').eq('tenant_id', currentTenant.id).single()
      ]);

      console.log('Admin settings result:', adminSettingsResult);
      console.log('Messages result:', messagesResult);
      console.log('Button texts result:', buttonTextsResult);

      // Process admin settings
      const adminSettings = adminSettingsResult.data || [];
      const settingsMap = adminSettings.reduce((acc: any, setting: any) => {
        try {
          acc[setting.key] = JSON.parse(setting.value);
        } catch {
          acc[setting.key] = setting.value;
        }
        return acc;
      }, {});

      // Process messages
      const messages = (messagesResult.data || []).reduce((acc: any, msg: any) => {
        acc[msg.type] = msg.content;
        return acc;
      }, {});

      // Process button texts
      const buttonTexts = (buttonTextsResult.data || []).reduce((acc: any, btn: any) => {
        acc[btn.key] = btn.text;
        return acc;
      }, {});

      // Process tutorials
      const tutorials = tutorialsResult.data || [];
      const wappTutorials = tutorials.filter((t: any) => t.type === 'wapp');
      const kratorTutorials = tutorials.filter((t: any) => t.type === 'krator');

      // Process contacts
      const allContacts = contactsResult.data || [];
      const contacts = allContacts.filter((c: any) => !c.is_reseller).map((c: any) => c.phone_number);
      const resellerContacts = allContacts.filter((c: any) => c.is_reseller).map((c: any) => c.phone_number);

      const result = {
        siteName: settingsMap.site_name || 'Wapp TV',
        siteLogoUrl: settingsMap.site_logo_url || '',
        popularText: settingsMap.popular_text || 'Mais Popular',
        kratorPrice: settingsMap.krator_price || 'R$ 15,00',
        plans: plansResult.data || [],
        wappTutorials,
        kratorTutorials,
        contacts,
        resellerContacts,
        messages: {
          default: messages.default || 'Olá! Estou interessado em seus serviços.',
          krator: messages.krator || 'Olá! Gostaria de saber mais sobre o plano Krator.',
          contact: messages.contact || 'Olá! Gostaria de entrar em contato.',
          trial4h: messages.trial4h || 'Olá! Gostaria de testar por 4 horas.',
          trial1h: messages.trial1h || 'Olá! Gostaria de testar o plano Krator.',
          reseller: messages.reseller || 'Olá! Tenho interesse em ser revendedor.'
        },
        buttonTexts: {
          trial4h: buttonTexts.trial4h || 'Teste 4 Horas Grátis',
          trial1h: buttonTexts.trial1h || 'Teste 1 Hora Grátis',
          reseller: buttonTexts.reseller || 'Seja Revendedor'
        },
        resellerSettings: {
          showButton: resellerSettingsResult.data?.show_button ?? true,
          creditPrices: resellerSettingsResult.data?.credit_prices || []
        },
        socialLinks: settingsMap.social_links || { facebook: '', instagram: '', youtube: '' },
        seoSettings: {
          title: settingsMap.seo_title || 'Wapp TV - IPTV de Qualidade',
          description: settingsMap.seo_description || 'Os melhores canais de TV em alta definição',
          keywords: settingsMap.seo_keywords || 'iptv, tv online, canais',
          ogTitle: settingsMap.seo_og_title || 'Wapp TV - IPTV de Qualidade',
          ogDescription: settingsMap.seo_og_description || 'Os melhores canais de TV em alta definição',
          ogImage: settingsMap.seo_og_image || '',
          twitterTitle: settingsMap.seo_twitter_title || 'Wapp TV - IPTV de Qualidade',
          twitterDescription: settingsMap.seo_twitter_description || 'Os melhores canais de TV em alta definição'
        }
      };

      console.log('Processed public data:', result);
      return result;
    },
    enabled: !tenantLoading && !!currentTenant,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const contextValue: PublicDataContextType = {
    data: publicData || {
      siteName: 'Wapp TV',
      siteLogoUrl: '',
      popularText: 'Mais Popular',
      kratorPrice: 'R$ 15,00',
      plans: [],
      wappTutorials: [],
      kratorTutorials: [],
      contacts: [],
      resellerContacts: [],
      messages: {
        default: 'Olá! Estou interessado em seus serviços.',
        krator: 'Olá! Gostaria de saber mais sobre o plano Krator.',
        contact: 'Olá! Gostaria de entrar em contato.',
        trial4h: 'Olá! Gostaria de testar por 4 horas.',
        trial1h: 'Olá! Gostaria de testar o plano Krator.',
        reseller: 'Olá! Tenho interesse em ser revendedor.'
      },
      buttonTexts: {
        trial4h: 'Teste 4 Horas Grátis',
        trial1h: 'Teste 1 Hora Grátis',
        reseller: 'Seja Revendedor'
      },
      resellerSettings: {
        showButton: true,
        creditPrices: []
      },
      socialLinks: { facebook: '', instagram: '', youtube: '' },
      seoSettings: {
        title: 'Wapp TV - IPTV de Qualidade',
        description: 'Os melhores canais de TV em alta definição',
        keywords: 'iptv, tv online, canais',
        ogTitle: 'Wapp TV - IPTV de Qualidade',
        ogDescription: 'Os melhores canais de TV em alta definição',
        ogImage: '',
        twitterTitle: 'Wapp TV - IPTV de Qualidade',
        twitterDescription: 'Os melhores canais de TV em alta definição'
      }
    },
    isLoading: isLoading || tenantLoading,
    error,
    refetch
  };

  return (
    <PublicDataContext.Provider value={contextValue}>
      {children}
    </PublicDataContext.Provider>
  );
};
