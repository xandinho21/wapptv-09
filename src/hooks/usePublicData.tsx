import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

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
  image: string;
  link: string;
}

interface PublicData {
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
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  kratorPrice: string;
  plans: Plan[];
  popularText: string;
  tutorials: {
    wapp: Tutorial[];
    krator: Tutorial[];
  };
  siteName: string;
  siteLogoUrl: string;
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
      features: string[];
      performanceTitle: string;
      performanceText: string;
      stabilityTitle: string;
      stabilityText: string;
      qualityTitle: string;
      qualityText: string;
      planSectionTitle: string;
      planName: string;
      planFeatures: string[];
      trialTitle: string;
      trialDuration: string;
      trialSubtitle: string;
      trialDescription: string;
      trialFeature: string;
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
      creditsText: string;
      perCreditText: string;
    };
    footer: {
      companyName: string;
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

const DEFAULT_PUBLIC_DATA: PublicData = {
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
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: ''
  },
  kratorPrice: 'R$ 25,00',
  plans: [],
  popularText: 'MAIS POPULAR',
  tutorials: {
    wapp: [],
    krator: []
  },
  siteName: 'Wapp TV',
  siteLogoUrl: '',
  seo: {
    title: 'Wapp TV - O Melhor da IPTV',
    description: 'Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator. Teste grátis disponível!',
    keywords: 'IPTV, Wapp TV, Krator, streaming, televisão online, planos IPTV, teste grátis',
    ogTitle: 'Wapp TV - O Melhor da IPTV',
    ogDescription: 'Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator.',
    ogImage: '',
    twitterTitle: 'Wapp TV - O Melhor da IPTV',
    twitterDescription: 'Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator.'
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
      description: 'O Krator é nosso sistema proprietário de streaming que garante a melhor qualidade de imagem, estabilidade de conexão e experiência de usuário incomparável. Desenvolvido especialmente para oferecer entretenimento sem interrupções.',
      features: ['Streaming em tempo real otimizado', 'Qualidade adaptativa automática', 'Cache inteligente para maior velocidade', 'Interface intuitiva e responsiva'],
      performanceTitle: 'Performance Superior',
      performanceText: 'Velocidade de carregamento 3x mais rápida comparado aos sistemas tradicionais',
      stabilityTitle: 'Estabilidade Garantida',
      stabilityText: '99.9% de uptime com servidores redundantes para máxima disponibilidade',
      qualityTitle: 'Qualidade Adaptativa',
      qualityText: 'Ajuste automático da qualidade baseado na sua conexão para melhor experiência',
      planSectionTitle: 'Plano com Sistema Krator',
      planName: 'Krator 1 Tela',
      planFeatures: ['1 Tela simultânea', 'Sistema Krator incluído', 'Alta qualidade', 'Streaming otimizado', 'Suporte via whatsapp'],
      trialTitle: 'Teste Grátis',
      trialDuration: '1 Hora',
      trialSubtitle: 'Sistema Krator',
      trialDescription: 'Experimente o sistema Krator gratuitamente e veja a diferença na qualidade do streaming.',
      trialFeature: 'Acesso completo por 1 hora'
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
      priceTableTitle: 'Tabela de Preços para Revendedores',
      creditsText: 'créditos',
      perCreditText: 'por crédito'
    },
    footer: {
      companyName: 'Wapp TV',
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
};

export const usePublicData = () => {
  const [data, setData] = useState<PublicData>(DEFAULT_PUBLIC_DATA);
  const [loading, setLoading] = useState(true);
  const { currentTenant } = useTenant();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!currentTenant) {
        return;
      }
      
      // Fetch all data in parallel with tenant filtering
      const [
        { data: contacts = [] },
        { data: messages = [] },
        { data: buttonTexts = [] },
        { data: adminSettings = [] },
        { data: plans = [] },
        { data: tutorials = [] },
        { data: resellerSettings = [] }
      ] = await Promise.all([
        supabase.from('contacts').select('*').eq('tenant_id', currentTenant.id),
        supabase.from('messages').select('*').eq('tenant_id', currentTenant.id),
        supabase.from('button_texts').select('*').eq('tenant_id', currentTenant.id),
        supabase.from('admin_settings').select('*').eq('tenant_id', currentTenant.id),
        supabase.from('plans').select('*').eq('tenant_id', currentTenant.id).order('sort_order'),
        supabase.from('tutorials').select('*').eq('tenant_id', currentTenant.id).order('sort_order'),
        supabase.from('reseller_settings').select('*').eq('tenant_id', currentTenant.id).limit(1)
      ]);

      // Process contacts
      const regularContacts = contacts.filter(c => !c.is_reseller).map(c => c.phone_number);
      const resellerContacts = contacts.filter(c => c.is_reseller).map(c => c.phone_number);

      // Process messages
      const messageMap = messages.reduce((acc, msg) => {
        acc[msg.type] = msg.content;
        return acc;
      }, {} as Record<string, string>);

      // Process button texts
      const buttonTextMap = buttonTexts.reduce((acc, btn) => {
        acc[btn.key] = btn.text;
        return acc;
      }, {} as Record<string, string>);

      // Process admin settings
      const settingsMap = adminSettings.reduce((acc, setting) => {
        try {
          acc[setting.key] = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
        } catch {
          acc[setting.key] = setting.value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Process plans
      const processedPlans = plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        period: plan.period,
        features: Array.isArray(plan.features) ? plan.features as string[] : [],
        popular: plan.popular
      }));

      // Process tutorials
      const wappTutorials = tutorials.filter(t => t.type === 'wapp').map(t => ({
        id: t.id,
        title: t.title,
        image: t.image,
        link: t.link
      }));
      
      const kratorTutorials = tutorials.filter(t => t.type === 'krator').map(t => ({
        id: t.id,
        title: t.title,
        image: t.image,
        link: t.link
      }));

      // Process reseller settings
      const resellerData = resellerSettings[0] || { show_button: true, credit_prices: [] };

      setData({
        contacts: regularContacts.length > 0 ? regularContacts : DEFAULT_PUBLIC_DATA.contacts,
        resellerContacts: resellerContacts.length > 0 ? resellerContacts : DEFAULT_PUBLIC_DATA.resellerContacts,
        messages: {
          default: messageMap.default || DEFAULT_PUBLIC_DATA.messages.default,
          krator: messageMap.krator || DEFAULT_PUBLIC_DATA.messages.krator,
          contact: messageMap.contact || DEFAULT_PUBLIC_DATA.messages.contact,
          trial4h: messageMap.trial4h || DEFAULT_PUBLIC_DATA.messages.trial4h,
          trial1h: messageMap.trial1h || DEFAULT_PUBLIC_DATA.messages.trial1h,
          reseller: messageMap.reseller || DEFAULT_PUBLIC_DATA.messages.reseller
        },
        buttonTexts: {
          trial4h: buttonTextMap.trial4h || DEFAULT_PUBLIC_DATA.buttonTexts.trial4h,
          trial1h: buttonTextMap.trial1h || DEFAULT_PUBLIC_DATA.buttonTexts.trial1h,
          reseller: buttonTextMap.reseller || DEFAULT_PUBLIC_DATA.buttonTexts.reseller
        },
        resellerSettings: {
          showButton: resellerData.show_button,
          creditPrices: Array.isArray(resellerData.credit_prices) 
            ? resellerData.credit_prices as { credits: number; price: string; }[]
            : DEFAULT_PUBLIC_DATA.resellerSettings.creditPrices
        },
        kratorPrice: settingsMap.krator_price || DEFAULT_PUBLIC_DATA.kratorPrice,
        plans: processedPlans.length > 0 ? processedPlans : DEFAULT_PUBLIC_DATA.plans,
        popularText: settingsMap.popular_text || DEFAULT_PUBLIC_DATA.popularText,
        tutorials: {
          wapp: wappTutorials,
          krator: kratorTutorials
        },
        siteName: settingsMap.site_name || DEFAULT_PUBLIC_DATA.siteName,
        siteLogoUrl: settingsMap.site_logo_url || DEFAULT_PUBLIC_DATA.siteLogoUrl,
        socialLinks: settingsMap.social_links || DEFAULT_PUBLIC_DATA.socialLinks,
        seo: {
          title: settingsMap.seo_title || DEFAULT_PUBLIC_DATA.seo.title,
          description: settingsMap.seo_description || DEFAULT_PUBLIC_DATA.seo.description,
          keywords: settingsMap.seo_keywords || DEFAULT_PUBLIC_DATA.seo.keywords,
          ogTitle: settingsMap.seo_og_title || DEFAULT_PUBLIC_DATA.seo.ogTitle,
          ogDescription: settingsMap.seo_og_description || DEFAULT_PUBLIC_DATA.seo.ogDescription,
          ogImage: settingsMap.seo_og_image || DEFAULT_PUBLIC_DATA.seo.ogImage,
          twitterTitle: settingsMap.seo_twitter_title || DEFAULT_PUBLIC_DATA.seo.twitterTitle,
          twitterDescription: settingsMap.seo_twitter_description || DEFAULT_PUBLIC_DATA.seo.twitterDescription
        },
        content: {
          hero: {
            title: settingsMap.hero_title || DEFAULT_PUBLIC_DATA.content.hero.title,
            subtitle: settingsMap.hero_subtitle || DEFAULT_PUBLIC_DATA.content.hero.subtitle,
            buttonText: settingsMap.hero_buttonText || DEFAULT_PUBLIC_DATA.content.hero.buttonText,
            priceText: settingsMap.hero_priceText || DEFAULT_PUBLIC_DATA.content.hero.priceText,
            initialPrice: settingsMap.hero_initialPrice || DEFAULT_PUBLIC_DATA.content.hero.initialPrice,
            card1Title: settingsMap.hero_card1Title || DEFAULT_PUBLIC_DATA.content.hero.card1Title,
            card1Subtitle: settingsMap.hero_card1Subtitle || DEFAULT_PUBLIC_DATA.content.hero.card1Subtitle,
            card2Title: settingsMap.hero_card2Title || DEFAULT_PUBLIC_DATA.content.hero.card2Title,
            card2Subtitle: settingsMap.hero_card2Subtitle || DEFAULT_PUBLIC_DATA.content.hero.card2Subtitle,
            card3Title: settingsMap.hero_card3Title || DEFAULT_PUBLIC_DATA.content.hero.card3Title,
            card3Subtitle: settingsMap.hero_card3Subtitle || DEFAULT_PUBLIC_DATA.content.hero.card3Subtitle
          },
          trial: {
            title: settingsMap.trial_title || DEFAULT_PUBLIC_DATA.content.trial.title,
            subtitle: settingsMap.trial_subtitle || DEFAULT_PUBLIC_DATA.content.trial.subtitle
          },
          krator: {
            mainTitle: settingsMap.krator_mainTitle || DEFAULT_PUBLIC_DATA.content.krator.mainTitle,
            mainSubtitle: settingsMap.krator_mainSubtitle || DEFAULT_PUBLIC_DATA.content.krator.mainSubtitle,
            whatTitle: settingsMap.krator_whatTitle || DEFAULT_PUBLIC_DATA.content.krator.whatTitle,
            description: settingsMap.krator_description || DEFAULT_PUBLIC_DATA.content.krator.description,
            features: settingsMap.krator_features || DEFAULT_PUBLIC_DATA.content.krator.features,
            performanceTitle: settingsMap.krator_performanceTitle || DEFAULT_PUBLIC_DATA.content.krator.performanceTitle,
            performanceText: settingsMap.krator_performanceText || DEFAULT_PUBLIC_DATA.content.krator.performanceText,
            stabilityTitle: settingsMap.krator_stabilityTitle || DEFAULT_PUBLIC_DATA.content.krator.stabilityTitle,
            stabilityText: settingsMap.krator_stabilityText || DEFAULT_PUBLIC_DATA.content.krator.stabilityText,
            qualityTitle: settingsMap.krator_qualityTitle || DEFAULT_PUBLIC_DATA.content.krator.qualityTitle,
            qualityText: settingsMap.krator_qualityText || DEFAULT_PUBLIC_DATA.content.krator.qualityText,
            planSectionTitle: settingsMap.krator_planSectionTitle || DEFAULT_PUBLIC_DATA.content.krator.planSectionTitle,
            planName: settingsMap.krator_planName || DEFAULT_PUBLIC_DATA.content.krator.planName,
            planFeatures: settingsMap.krator_planFeatures || DEFAULT_PUBLIC_DATA.content.krator.planFeatures,
            trialTitle: settingsMap.krator_trialTitle || DEFAULT_PUBLIC_DATA.content.krator.trialTitle,
            trialDuration: settingsMap.krator_trialDuration || DEFAULT_PUBLIC_DATA.content.krator.trialDuration,
            trialSubtitle: settingsMap.krator_trialSubtitle || DEFAULT_PUBLIC_DATA.content.krator.trialSubtitle,
            trialDescription: settingsMap.krator_trialDescription || DEFAULT_PUBLIC_DATA.content.krator.trialDescription,
            trialFeature: settingsMap.krator_trialFeature || DEFAULT_PUBLIC_DATA.content.krator.trialFeature
          },
          reseller: {
            title: settingsMap.reseller_title || DEFAULT_PUBLIC_DATA.content.reseller.title,
            subtitle: settingsMap.reseller_subtitle || DEFAULT_PUBLIC_DATA.content.reseller.subtitle,
            supportTitle: settingsMap.reseller_supportTitle || DEFAULT_PUBLIC_DATA.content.reseller.supportTitle,
            supportText: settingsMap.reseller_supportText || DEFAULT_PUBLIC_DATA.content.reseller.supportText,
            commissionTitle: settingsMap.reseller_commissionTitle || DEFAULT_PUBLIC_DATA.content.reseller.commissionTitle,
            commissionText: settingsMap.reseller_commissionText || DEFAULT_PUBLIC_DATA.content.reseller.commissionText,
            qualityTitle: settingsMap.reseller_qualityTitle || DEFAULT_PUBLIC_DATA.content.reseller.qualityTitle,
            qualityText: settingsMap.reseller_qualityText || DEFAULT_PUBLIC_DATA.content.reseller.qualityText,
            priceTableTitle: settingsMap.reseller_priceTableTitle || DEFAULT_PUBLIC_DATA.content.reseller.priceTableTitle,
            creditsText: settingsMap.reseller_creditsText || DEFAULT_PUBLIC_DATA.content.reseller.creditsText,
            perCreditText: settingsMap.reseller_perCreditText || DEFAULT_PUBLIC_DATA.content.reseller.perCreditText
          },
          footer: {
            companyName: settingsMap.footer_companyName || DEFAULT_PUBLIC_DATA.content.footer.companyName,
            companyDescription: settingsMap.footer_companyDescription || DEFAULT_PUBLIC_DATA.content.footer.companyDescription,
            copyright: settingsMap.footer_copyright || DEFAULT_PUBLIC_DATA.content.footer.copyright,
            linksTitle: settingsMap.footer_linksTitle || DEFAULT_PUBLIC_DATA.content.footer.linksTitle,
            contactTitle: settingsMap.footer_contactTitle || DEFAULT_PUBLIC_DATA.content.footer.contactTitle,
            linkInicio: settingsMap.footer_linkInicio || DEFAULT_PUBLIC_DATA.content.footer.linkInicio,
            linkPlanos: settingsMap.footer_linkPlanos || DEFAULT_PUBLIC_DATA.content.footer.linkPlanos,
            linkKrator: settingsMap.footer_linkKrator || DEFAULT_PUBLIC_DATA.content.footer.linkKrator,
            linkSupport: settingsMap.footer_linkSupport || DEFAULT_PUBLIC_DATA.content.footer.linkSupport,
            whatsappButton: settingsMap.footer_whatsappButton || DEFAULT_PUBLIC_DATA.content.footer.whatsappButton,
            activationText: settingsMap.footer_activationText || DEFAULT_PUBLIC_DATA.content.footer.activationText,
            socialTitle: settingsMap.footer_socialTitle || DEFAULT_PUBLIC_DATA.content.footer.socialTitle,
            tagline: settingsMap.footer_tagline || DEFAULT_PUBLIC_DATA.content.footer.tagline
          }
        }
      });
    } catch (error) {
      console.error('Error fetching public data:', error);
      setData(DEFAULT_PUBLIC_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentTenant) {
      fetchData();

      // Set up real-time subscriptions for data updates
      const channels = [
        supabase.channel('contacts-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, fetchData),
        supabase.channel('messages-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchData),
        supabase.channel('button_texts-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'button_texts' }, fetchData),
        supabase.channel('admin_settings-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'admin_settings' }, fetchData),
        supabase.channel('plans-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'plans' }, fetchData),
        supabase.channel('tutorials-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'tutorials' }, fetchData),
        supabase.channel('reseller_settings-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'reseller_settings' }, fetchData)
      ];

      channels.forEach(channel => channel.subscribe());

      return () => {
        channels.forEach(channel => supabase.removeChannel(channel));
      };
    }
  }, [currentTenant]);

  return { data, loading, refetch: fetchData };
};
