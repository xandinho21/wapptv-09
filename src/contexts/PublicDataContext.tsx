
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
  tutorials: {
    wapp: any[];
    krator: any[];
  };
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
    };
    footer: {
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

      // Process reseller settings with proper type checking
      const resellerData = resellerSettingsResult.data;
      let creditPrices: { credits: number; price: string; }[] = [];
      
      if (resellerData?.credit_prices && Array.isArray(resellerData.credit_prices)) {
        creditPrices = resellerData.credit_prices as { credits: number; price: string; }[];
      }

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
          showButton: resellerData?.show_button ?? true,
          creditPrices
        },
        socialLinks: settingsMap.social_links || { facebook: '', instagram: '', youtube: '' },
        tutorials: {
          wapp: wappTutorials,
          krator: kratorTutorials
        },
        seo: {
          title: settingsMap.seo_title || 'Wapp TV - IPTV de Qualidade',
          description: settingsMap.seo_description || 'Os melhores canais de TV em alta definição',
          keywords: settingsMap.seo_keywords || 'iptv, tv online, canais',
          ogTitle: settingsMap.seo_og_title || 'Wapp TV - IPTV de Qualidade',
          ogDescription: settingsMap.seo_og_description || 'Os melhores canais de TV em alta definição',
          ogImage: settingsMap.seo_og_image || '',
          twitterTitle: settingsMap.seo_twitter_title || 'Wapp TV - IPTV de Qualidade',
          twitterDescription: settingsMap.seo_twitter_description || 'Os melhores canais de TV em alta definição'
        },
        content: {
          hero: {
            title: settingsMap.hero_title || 'Experimente o Melhor do Streaming',
            subtitle: settingsMap.hero_subtitle || 'Entretenimento de qualidade com tecnologia avançada. Desfrute de milhares de canais, filmes e séries com a melhor qualidade de streaming.',
            buttonText: settingsMap.hero_buttonText || 'Ver Planos',
            priceText: settingsMap.hero_priceText || 'A partir de',
            initialPrice: settingsMap.hero_initialPrice || 'R$ 25,00',
            card1Title: settingsMap.hero_card1Title || 'Streaming',
            card1Subtitle: settingsMap.hero_card1Subtitle || 'Qualidade Premium',
            card2Title: settingsMap.hero_card2Title || 'Suporte',
            card2Subtitle: settingsMap.hero_card2Subtitle || 'Pelo Whatsapp',
            card3Title: settingsMap.hero_card3Title || '15.000+',
            card3Subtitle: settingsMap.hero_card3Subtitle || 'Conteúdos Disponíveis'
          },
          trial: {
            title: settingsMap.trial_title || 'Experimente Antes de Comprar',
            subtitle: settingsMap.trial_subtitle || 'Teste nossa plataforma gratuitamente por 4 horas e veja a qualidade do nosso serviço'
          },
          krator: {
            mainTitle: settingsMap.krator_mainTitle || 'Conheça o Novo Sistema Krator',
            mainSubtitle: settingsMap.krator_mainSubtitle || 'Tecnologia revolucionária que transforma sua experiência de entretenimento',
            whatTitle: settingsMap.krator_whatTitle || 'O que é o Krator?',
            description: settingsMap.krator_description || 'O Krator é nosso sistema proprietário de streaming que garante a melhor qualidade de imagem, estabilidade de conexão e experiência de usuário incomparável.'
          },
          reseller: {
            title: settingsMap.reseller_title || 'Seja um Revendedor',
            subtitle: settingsMap.reseller_subtitle || 'Faça parte da nossa rede de revendedores e tenha uma fonte extra de renda vendendo nossos produtos com excelente suporte e comissões atrativas.',
            supportTitle: settingsMap.reseller_supportTitle || 'Suporte Completo',
            supportText: settingsMap.reseller_supportText || 'Oferecemos suporte técnico e comercial para você e seus clientes',
            commissionTitle: settingsMap.reseller_commissionTitle || 'Comissões Atrativas',
            commissionText: settingsMap.reseller_commissionText || 'Ganhe comissões competitivas em cada venda realizada',
            qualityTitle: settingsMap.reseller_qualityTitle || 'Produtos de Qualidade',
            qualityText: settingsMap.reseller_qualityText || 'Venda produtos testados e aprovados por milhares de clientes',
            priceTableTitle: settingsMap.reseller_priceTableTitle || 'Tabela de Preços para Revendedores'
          },
          footer: {
            companyDescription: settingsMap.footer_companyDescription || 'A melhor experiência em streaming com tecnologia avançada. Entretenimento de qualidade para toda a família.',
            copyright: settingsMap.footer_copyright || '© 2025 Wapp TV. Todos os direitos reservados.',
            linksTitle: settingsMap.footer_linksTitle || 'Links Úteis',
            contactTitle: settingsMap.footer_contactTitle || 'Contato',
            linkInicio: settingsMap.footer_linkInicio || 'Início',
            linkPlanos: settingsMap.footer_linkPlanos || 'Planos',
            linkKrator: settingsMap.footer_linkKrator || 'Sistema Krator',
            linkSupport: settingsMap.footer_linkSupport || 'Suporte Técnico',
            whatsappButton: settingsMap.footer_whatsappButton || 'Falar no WhatsApp',
            activationText: settingsMap.footer_activationText || '⚡ Ativação imediata',
            socialTitle: settingsMap.footer_socialTitle || 'Redes Sociais',
            tagline: settingsMap.footer_tagline || 'Wapp TV - Transformando sua experiência de entretenimento'
          }
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
      tutorials: {
        wapp: [],
        krator: []
      },
      seo: {
        title: 'Wapp TV - IPTV de Qualidade',
        description: 'Os melhores canais de TV em alta definição',
        keywords: 'iptv, tv online, canais',
        ogTitle: 'Wapp TV - IPTV de Qualidade',
        ogDescription: 'Os melhores canais de TV em alta definição',
        ogImage: '',
        twitterTitle: 'Wapp TV - IPTV de Qualidade',
        twitterDescription: 'Os melhores canais de TV em alta definição'
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
          description: 'O Krator é nosso sistema proprietário de streaming que garante a melhor qualidade de imagem, estabilidade de conexão e experiência de usuário incomparável.'
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
          priceTableTitle: 'Tabela de Preços para Revendedores'
        },
        footer: {
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
