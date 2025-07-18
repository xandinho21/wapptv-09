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
  krator_trial_button_bg_color: string;
  krator_trial_button_text_color: string;
  krator_trial_button_hover_color: string;
}

export const useTheme = () => {
  const [themes, setThemes] = useState<ThemeSettings[]>([]);
  const [activeTheme, setActiveTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentTenant = async () => {
    try {
      const currentDomain = window.location.hostname;
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('id')
        .or(`domain.eq.${currentDomain},subdomain.eq.${currentDomain}`)
        .eq('is_active', true)
        .single();

      if (error) {
        // Fallback to default tenant
        const { data: defaultTenant } = await supabase
          .from('tenants')
          .select('id')
          .eq('domain', 'wapptv.top')
          .single();
        
        return defaultTenant?.id || null;
      }

      return tenant?.id || null;
    } catch (error) {
      console.error('Error getting tenant:', error);
      return null;
    }
  };

  const fetchThemes = async () => {
    try {
      // Fetch all global themes (no tenant filter)
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setThemes(data || []);

      // Fetch active theme for current tenant
      if (tenantId) {
        await fetchActiveTheme();
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

  const fetchActiveTheme = async () => {
    try {
      if (!tenantId) return;

      const { data, error } = await supabase
        .from('tenant_theme_preferences')
        .select(`
          active_theme_id,
          theme_settings!inner(*)
        `)
        .eq('tenant_id', tenantId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.theme_settings) {
        const activeTheme = data.theme_settings as any as ThemeSettings;
        setActiveTheme(activeTheme);
        applyTheme(activeTheme);
      } else {
        // No theme preference set, use first available theme as default
        const { data: themes } = await supabase
          .from('theme_settings')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(1);
        
        if (themes?.[0]) {
          await activateTheme(themes[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching active theme:', error);
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
    
    // Apply Krator trial button colors
    root.style.setProperty('--krator-trial-button-bg', theme.krator_trial_button_bg_color);
    root.style.setProperty('--krator-trial-button-text', theme.krator_trial_button_text_color);
    root.style.setProperty('--krator-trial-button-hover', theme.krator_trial_button_hover_color);
  };

  const activateTheme = async (themeId: string) => {
    try {
      if (!tenantId) return;

      // Upsert tenant theme preference
      const { error } = await supabase
        .from('tenant_theme_preferences')
        .upsert({ 
          tenant_id: tenantId, 
          active_theme_id: themeId 
        }, { 
          onConflict: 'tenant_id' 
        });

      if (error) throw error;

      // Find the activated theme and apply it
      const activatedTheme = themes.find(theme => theme.id === themeId);
      if (activatedTheme) {
        setActiveTheme(activatedTheme);
        applyTheme(activatedTheme);
      }
      
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
      // Update global theme (only admins should have access to this)
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
      // Create global theme (no tenant_id)
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
          krator_trial_button_bg_color: originalTheme.krator_trial_button_bg_color,
          krator_trial_button_text_color: originalTheme.krator_trial_button_text_color,
          krator_trial_button_hover_color: originalTheme.krator_trial_button_hover_color,
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

  const deleteTheme = async (themeId: string, themeName: string) => {
    try {
      // Check if theme is currently active for this tenant
      if (activeTheme?.id === themeId) {
        toast({
          title: "Erro",
          description: "Não é possível excluir o tema ativo. Ative outro tema primeiro.",
          variant: "destructive",
        });
        return;
      }

      // Delete global theme
      const { error } = await supabase
        .from('theme_settings')
        .delete()
        .eq('id', themeId);

      if (error) throw error;

      await fetchThemes();
      
      toast({
        title: "Tema Excluído",
        description: `Tema "${themeName}" foi excluído com sucesso!`,
      });
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir tema",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const initializeThemes = async () => {
      const currentTenantId = await getCurrentTenant();
      setTenantId(currentTenantId);
      if (currentTenantId) {
        await fetchThemes();
      } else {
        setLoading(false);
      }
    };

    initializeThemes();
  }, []);

  return {
    themes,
    activeTheme,
    loading,
    activateTheme,
    updateTheme,
    duplicateTheme,
    deleteTheme,
    fetchThemes,
    applyTheme,
  };
};