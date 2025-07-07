
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  kratorPrice: string;
  plans: Plan[];
  popularText: string;
  tutorials: {
    wapp: Tutorial[];
    krator: Tutorial[];
  };
  siteName: string;
  siteLogoUrl: string;
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
  kratorPrice: 'R$ 25,00',
  plans: [],
  popularText: 'MAIS POPULAR',
  tutorials: {
    wapp: [],
    krator: []
  },
  siteName: 'Wapp TV',
  siteLogoUrl: ''
};

export const usePublicData = () => {
  const [data, setData] = useState<PublicData>(DEFAULT_PUBLIC_DATA);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        { data: contacts = [] },
        { data: messages = [] },
        { data: buttonTexts = [] },
        { data: adminSettings = [] },
        { data: plans = [] },
        { data: tutorials = [] },
        { data: resellerSettings = [] }
      ] = await Promise.all([
        supabase.from('contacts').select('*'),
        supabase.from('messages').select('*'),
        supabase.from('button_texts').select('*'),
        supabase.from('admin_settings').select('*'),
        supabase.from('plans').select('*').order('sort_order'),
        supabase.from('tutorials').select('*').order('sort_order'),
        supabase.from('reseller_settings').select('*').limit(1)
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
        siteLogoUrl: settingsMap.site_logo_url || DEFAULT_PUBLIC_DATA.siteLogoUrl
      });
    } catch (error) {
      console.error('Error fetching public data:', error);
      setData(DEFAULT_PUBLIC_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  }, []);

  return { data, loading, refetch: fetchData };
};
