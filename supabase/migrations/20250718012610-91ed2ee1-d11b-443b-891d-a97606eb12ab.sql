-- Create tenant_theme_preferences table for tenant-specific theme activation
CREATE TABLE public.tenant_theme_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  active_theme_id UUID NOT NULL REFERENCES public.theme_settings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id)
);

-- Enable RLS
ALTER TABLE public.tenant_theme_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant theme preferences
CREATE POLICY "Tenant theme preferences are viewable by everyone" 
ON public.tenant_theme_preferences 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify tenant theme preferences" 
ON public.tenant_theme_preferences 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_tenant_theme_preferences_updated_at
BEFORE UPDATE ON public.tenant_theme_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Make tenant_id optional in theme_settings (themes become global)
ALTER TABLE public.theme_settings ALTER COLUMN tenant_id DROP NOT NULL;

-- Migrate existing active themes to tenant_theme_preferences
INSERT INTO public.tenant_theme_preferences (tenant_id, active_theme_id)
SELECT 
  t.tenant_id,
  t.id as active_theme_id
FROM public.theme_settings t
WHERE t.is_active = true AND t.tenant_id IS NOT NULL;

-- Make all themes global by setting tenant_id to NULL and is_active to false
UPDATE public.theme_settings SET tenant_id = NULL, is_active = false;