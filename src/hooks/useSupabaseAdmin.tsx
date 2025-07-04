
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  type: 'wapp' | 'krator';
}

interface AdminConfig {
  id: string;
  user_id: string;
  contacts: string[];
  reseller_contacts: string[];
  messages: {
    default: string;
    krator: string;
    contact: string;
    trial4h: string;
    trial1h: string;
    reseller: string;
  };
  button_texts: {
    trial4h: string;
    trial1h: string;
    reseller: string;
  };
  reseller_settings: {
    showButton: boolean;
    creditPrices: {
      credits: number;
      price: string;
    }[];
  };
  krator_price: string;
  popular_text: string;
}

export const useSupabaseAdmin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch admin config using raw query
  const { data: adminConfig } = useQuery({
    queryKey: ['admin-config', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('admin_configs' as any)
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching admin config:', error);
          
          // If no config exists, create one with default values
          const { data: newConfig, error: insertError } = await supabase
            .from('admin_configs' as any)
            .insert([{ 
              user_id: user.id,
              contacts: ['+5519993075627', '+5519995753398'],
              reseller_contacts: ['+5519993075627'],
              messages: {
                default: 'Olá! Gostaria de contratar um plano da Wapp TV. Podem me ajudar?',
                krator: 'Olá! Gostaria de contratar um plano da Wapp TV com o sistema Krator. Podem me ajudar?',
                contact: 'Olá! Gostaria de mais informações sobre a Wapp TV.',
                trial4h: 'Olá! Gostaria de solicitar um teste grátis de 4 horas da Wapp TV. Podem me ajudar?',
                trial1h: 'Olá! Gostaria de solicitar um teste grátis de 1 hora do sistema Krator. Podem me ajudar?',
                reseller: 'Olá! Gostaria de informações sobre como me tornar um revendedor da Wapp TV. Podem me ajudar?'
              },
              button_texts: {
                trial4h: 'Teste Grátis 4h',
                trial1h: 'Teste Grátis 1h',
                reseller: 'Quero ser um revendedor'
              },
              reseller_settings: {
                showButton: true,
                creditPrices: [
                  { credits: 10, price: 'R$ 11,00' },
                  { credits: 30, price: 'R$ 10,00' },
                  { credits: 50, price: 'R$ 8,00' },
                  { credits: 100, price: 'R$ 7,00' },
                  { credits: 500, price: 'R$ 6,00' }
                ]
              },
              krator_price: 'R$ 25,00',
              popular_text: 'MAIS POPULAR'
            }])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating admin config:', insertError);
            return null;
          }
          return newConfig;
        }

        return data;
      } catch (err) {
        console.error('Admin config fetch error:', err);
        return null;
      }
    },
    enabled: !!user?.id,
  });

  // Fetch plans
  const { data: plans = [] } = useQuery({
    queryKey: ['plans', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const { data, error } = await supabase
          .from('plans' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at');

        if (error) {
          console.error('Error fetching plans:', error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error('Plans fetch error:', err);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Fetch tutorials
  const { data: tutorials } = useQuery({
    queryKey: ['tutorials', user?.id],
    queryFn: async () => {
      if (!user?.id) return { wapp: [], krator: [] };
      
      try {
        const { data, error } = await supabase
          .from('tutorials' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at');

        if (error) {
          console.error('Error fetching tutorials:', error);
          return { wapp: [], krator: [] };
        }

        const wappTutorials = data?.filter((t: any) => t.type === 'wapp') || [];
        const kratorTutorials = data?.filter((t: any) => t.type === 'krator') || [];

        return {
          wapp: wappTutorials,
          krator: kratorTutorials
        };
      } catch (err) {
        console.error('Tutorials fetch error:', err);
        return { wapp: [], krator: [] };
      }
    },
    enabled: !!user?.id,
  });

  // Update admin config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (updates: Partial<AdminConfig>) => {
      if (!user?.id || !adminConfig?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('admin_configs' as any)
        .update(updates)
        .eq('id', adminConfig.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-config', user?.id] });
    },
  });

  // Plans mutations
  const updatePlansMutation = useMutation({
    mutationFn: async (newPlans: Plan[]) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete existing plans
      await supabase.from('plans' as any).delete().eq('user_id', user.id);

      // Insert new plans
      const plansToInsert = newPlans.map(plan => ({
        ...plan,
        user_id: user.id,
      }));

      if (plansToInsert.length > 0) {
        const { error } = await supabase.from('plans' as any).insert(plansToInsert);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', user?.id] });
    },
  });

  // Tutorials mutations
  const updateTutorialsMutation = useMutation({
    mutationFn: async ({ type, tutorials: newTutorials }: { type: 'wapp' | 'krator', tutorials: Tutorial[] }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete existing tutorials of this type
      await supabase.from('tutorials' as any).delete().eq('user_id', user.id).eq('type', type);

      // Insert new tutorials
      const tutorialsToInsert = newTutorials.map(tutorial => ({
        ...tutorial,
        user_id: user.id,
        type,
      }));

      if (tutorialsToInsert.length > 0) {
        const { error } = await supabase.from('tutorials' as any).insert(tutorialsToInsert);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials', user?.id] });
    },
  });

  return {
    adminConfig,
    plans,
    tutorials: tutorials || { wapp: [], krator: [] },
    updateContacts: (contacts: string[]) => updateConfigMutation.mutate({ contacts }),
    updateResellerContacts: (reseller_contacts: string[]) => updateConfigMutation.mutate({ reseller_contacts }),
    updateMessages: (messages: AdminConfig['messages']) => updateConfigMutation.mutate({ messages }),
    updateButtonTexts: (button_texts: AdminConfig['button_texts']) => updateConfigMutation.mutate({ button_texts }),
    updateResellerSettings: (reseller_settings: AdminConfig['reseller_settings']) => updateConfigMutation.mutate({ reseller_settings }),
    updateKratorPrice: (krator_price: string) => updateConfigMutation.mutate({ krator_price }),
    updatePlans: (plans: Plan[]) => updatePlansMutation.mutate(plans),
    updatePopularText: (popular_text: string) => updateConfigMutation.mutate({ popular_text }),
    updateTutorials: (type: 'wapp' | 'krator', tutorials: Tutorial[]) => updateTutorialsMutation.mutate({ type, tutorials }),
    isLoading: updateConfigMutation.isPending || updatePlansMutation.isPending || updateTutorialsMutation.isPending,
  };
};
