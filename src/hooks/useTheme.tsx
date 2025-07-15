import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ThemeSettings {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  krator_primary_color: string;
  krator_secondary_color: string;
}

export const useTheme = () => {
  const [themes, setThemes] = useState<ThemeSettings[]>([]);
  const [activeTheme, setActiveTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setThemes(data || []);
      const active = data?.find(theme => theme.is_active);
      if (active) {
        setActiveTheme(active);
        applyTheme(active);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar temas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme: ThemeSettings) => {
    const root = document.documentElement;
    
    // Apply main theme colors
    root.style.setProperty('--theme-primary', theme.primary_color);
    root.style.setProperty('--theme-secondary', theme.secondary_color);
    root.style.setProperty('--theme-accent', theme.accent_color);
    
    // Apply Krator-specific colors
    root.style.setProperty('--krator-primary', theme.krator_primary_color);
    root.style.setProperty('--krator-secondary', theme.krator_secondary_color);
  };

  const activateTheme = async (themeId: string) => {
    try {
      // Deactivate all themes first
      await supabase
        .from('theme_settings')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

      // Activate selected theme
      const { error } = await supabase
        .from('theme_settings')
        .update({ is_active: true })
        .eq('id', themeId);

      if (error) throw error;

      await fetchThemes();
      
      toast({
        title: "Tema Aplicado",
        description: "O tema foi aplicado com sucesso!",
      });
    } catch (error) {
      console.error('Error activating theme:', error);
      toast({
        title: "Erro",
        description: "Erro ao aplicar tema",
        variant: "destructive",
      });
    }
  };

  const updateTheme = async (themeId: string, updates: Partial<ThemeSettings>) => {
    try {
      const { error } = await supabase
        .from('theme_settings')
        .update(updates)
        .eq('id', themeId);

      if (error) throw error;

      await fetchThemes();
      
      toast({
        title: "Tema Atualizado",
        description: "As alterações foram salvas com sucesso!",
      });
    } catch (error) {
      console.error('Error updating theme:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tema",
        variant: "destructive",
      });
    }
  };

  const duplicateTheme = async (originalTheme: ThemeSettings, newName: string) => {
    try {
      const { error } = await supabase
        .from('theme_settings')
        .insert({
          name: newName,
          slug: newName.toLowerCase().replace(/\s+/g, '-'),
          is_active: false,
          primary_color: originalTheme.primary_color,
          secondary_color: originalTheme.secondary_color,
          accent_color: originalTheme.accent_color,
          krator_primary_color: originalTheme.krator_primary_color,
          krator_secondary_color: originalTheme.krator_secondary_color,
        });

      if (error) throw error;

      await fetchThemes();
      
      toast({
        title: "Tema Duplicado",
        description: `Tema "${newName}" criado com sucesso!`,
      });
    } catch (error) {
      console.error('Error duplicating theme:', error);
      toast({
        title: "Erro",
        description: "Erro ao duplicar tema",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  return {
    themes,
    activeTheme,
    loading,
    activateTheme,
    updateTheme,
    duplicateTheme,
    fetchThemes,
    applyTheme,
  };
};