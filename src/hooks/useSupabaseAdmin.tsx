
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

  // Fetch admin config
  const { data: adminConfig } = useQuery({
    queryKey: ['admin-config', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('admin_configs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching admin config:', error);
        throw error;
      }

      // If no config exists, create one
      if (!data) {
        const { data: newConfig, error: insertError } = await supabase
          .from('admin_configs')
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating admin config:', insertError);
          throw insertError;
        }
        return newConfig;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch plans
  const { data: plans = [] } = useQuery({
    queryKey: ['plans', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch tutorials
  const { data: tutorials } = useQuery({
    queryKey: ['tutorials', user?.id],
    queryFn: async () => {
      if (!user?.id) return { wapp: [], krator: [] };
      
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) {
        console.error('Error fetching tutorials:', error);
        throw error;
      }

      const wappTutorials = data?.filter(t => t.type === 'wapp') || [];
      const kratorTutorials = data?.filter(t => t.type === 'krator') || [];

      return {
        wapp: wappTutorials,
        krator: kratorTutorials
      };
    },
    enabled: !!user?.id,
  });

  // Update admin config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (updates: Partial<AdminConfig>) => {
      if (!user?.id || !adminConfig?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('admin_configs')
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
      await supabase.from('plans').delete().eq('user_id', user.id);

      // Insert new plans
      const plansToInsert = newPlans.map(plan => ({
        ...plan,
        user_id: user.id,
      }));

      const { error } = await supabase.from('plans').insert(plansToInsert);
      if (error) throw error;
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
      await supabase.from('tutorials').delete().eq('user_id', user.id).eq('type', type);

      // Insert new tutorials
      const tutorialsToInsert = newTutorials.map(tutorial => ({
        ...tutorial,
        user_id: user.id,
        type,
      }));

      if (tutorialsToInsert.length > 0) {
        const { error } = await supabase.from('tutorials').insert(tutorialsToInsert);
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
