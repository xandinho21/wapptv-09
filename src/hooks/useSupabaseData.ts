
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  display_order: number;
}

interface Tutorial {
  id: string;
  title: string;
  image_url: string | null;
  link: string;
  type: 'wapp' | 'krator';
  display_order: number;
}

interface AdminSettings {
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

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      console.log('Fetching admin settings...');
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching admin settings:', error);
        throw error;
      }
      
      console.log('Admin settings fetched:', data);
      
      // Type cast the JSONB fields to their expected types
      const typedData: AdminSettings = {
        id: data.id,
        contacts: data.contacts,
        reseller_contacts: data.reseller_contacts,
        messages: data.messages as AdminSettings['messages'],
        button_texts: data.button_texts as AdminSettings['button_texts'],
        reseller_settings: data.reseller_settings as AdminSettings['reseller_settings'],
        krator_price: data.krator_price,
        popular_text: data.popular_text
      };
      
      return typedData;
    },
  });
};

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      console.log('Fetching plans...');
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }
      
      console.log('Plans fetched:', data);
      return data as Plan[];
    },
  });
};

export const useTutorials = (type?: 'wapp' | 'krator') => {
  return useQuery({
    queryKey: ['tutorials', type],
    queryFn: async () => {
      console.log('Fetching tutorials for type:', type);
      let query = supabase
        .from('tutorials')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tutorials:', error);
        throw error;
      }
      
      console.log('Tutorials fetched:', data);
      return data as Tutorial[];
    },
  });
};

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<AdminSettings>) => {
      console.log('Updating admin settings:', updates);
      const { data, error } = await supabase
        .from('admin_settings')
        .update(updates)
        .eq('id', (await supabase.from('admin_settings').select('id').single()).data?.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating admin settings:', error);
        throw error;
      }
      
      console.log('Admin settings updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating admin settings:', error);
      toast.error('Erro ao atualizar configurações');
    },
  });
};

export const useUpdatePlans = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plans: Plan[]) => {
      console.log('Updating plans:', plans);
      
      // Delete all existing plans first
      await supabase.from('plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert new plans
      const { data, error } = await supabase
        .from('plans')
        .insert(plans.map(plan => ({
          name: plan.name,
          price: plan.price,
          period: plan.period,
          features: plan.features,
          popular: plan.popular,
          display_order: plan.display_order
        })))
        .select();
      
      if (error) {
        console.error('Error updating plans:', error);
        throw error;
      }
      
      console.log('Plans updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Planos atualizados com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating plans:', error);
      toast.error('Erro ao atualizar planos');
    },
  });
};

export const useUpdateTutorials = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ type, tutorials }: { type: 'wapp' | 'krator', tutorials: Tutorial[] }) => {
      console.log('Updating tutorials for type:', type, tutorials);
      
      // Delete existing tutorials of this type
      await supabase.from('tutorials').delete().eq('type', type);
      
      // Insert new tutorials
      const { data, error } = await supabase
        .from('tutorials')
        .insert(tutorials.map(tutorial => ({
          title: tutorial.title,
          image_url: tutorial.image_url,
          link: tutorial.link,
          type: tutorial.type,
          display_order: tutorial.display_order
        })))
        .select();
      
      if (error) {
        console.error('Error updating tutorials:', error);
        throw error;
      }
      
      console.log('Tutorials updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
      toast.success('Tutoriais atualizados com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating tutorials:', error);
      toast.error('Erro ao atualizar tutoriais');
    },
  });
};
