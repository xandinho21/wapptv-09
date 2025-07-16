-- Create tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  subdomain TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tenants table
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants table
CREATE POLICY "Tenants are viewable by everyone" 
ON public.tenants 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify tenants" 
ON public.tenants 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Add tenant_id to all existing tables
ALTER TABLE public.admin_settings ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.button_texts ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.contacts ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.plans ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.reseller_settings ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.theme_settings ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.tutorials ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Update RLS policies to include tenant isolation
-- Admin settings
DROP POLICY IF EXISTS "Admin settings are viewable by everyone" ON public.admin_settings;
CREATE POLICY "Admin settings are viewable by tenant" 
ON public.admin_settings 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify admin settings" ON public.admin_settings;
CREATE POLICY "Only authenticated users can modify admin settings" 
ON public.admin_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Button texts
DROP POLICY IF EXISTS "Button texts are viewable by everyone" ON public.button_texts;
CREATE POLICY "Button texts are viewable by tenant" 
ON public.button_texts 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify button texts" ON public.button_texts;
CREATE POLICY "Only authenticated users can modify button texts" 
ON public.button_texts 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Contacts
DROP POLICY IF EXISTS "Contacts are viewable by everyone" ON public.contacts;
CREATE POLICY "Contacts are viewable by tenant" 
ON public.contacts 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify contacts" ON public.contacts;
CREATE POLICY "Only authenticated users can modify contacts" 
ON public.contacts 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Messages
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON public.messages;
CREATE POLICY "Messages are viewable by tenant" 
ON public.messages 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify messages" ON public.messages;
CREATE POLICY "Only authenticated users can modify messages" 
ON public.messages 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Plans
DROP POLICY IF EXISTS "Plans are viewable by everyone" ON public.plans;
CREATE POLICY "Plans are viewable by tenant" 
ON public.plans 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify plans" ON public.plans;
CREATE POLICY "Only authenticated users can modify plans" 
ON public.plans 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Reseller settings
DROP POLICY IF EXISTS "Reseller settings are viewable by everyone" ON public.reseller_settings;
CREATE POLICY "Reseller settings are viewable by tenant" 
ON public.reseller_settings 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify reseller settings" ON public.reseller_settings;
CREATE POLICY "Only authenticated users can modify reseller settings" 
ON public.reseller_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Theme settings
DROP POLICY IF EXISTS "Theme settings are viewable by everyone" ON public.theme_settings;
CREATE POLICY "Theme settings are viewable by tenant" 
ON public.theme_settings 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify theme settings" ON public.theme_settings;
CREATE POLICY "Only authenticated users can modify theme settings" 
ON public.theme_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Tutorials
DROP POLICY IF EXISTS "Tutorials are viewable by everyone" ON public.tutorials;
CREATE POLICY "Tutorials are viewable by tenant" 
ON public.tutorials 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can modify tutorials" ON public.tutorials;
CREATE POLICY "Only authenticated users can modify tutorials" 
ON public.tutorials 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for updating updated_at on tenants
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a default tenant for existing data
INSERT INTO public.tenants (name, domain, subdomain, is_active) 
VALUES ('Wapp TV', 'wapptv.top', 'main', true);

-- Get the default tenant ID for updating existing records
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants WHERE domain = 'wapptv.top';
    
    -- Update existing records to associate with default tenant
    UPDATE public.admin_settings SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.button_texts SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.contacts SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.messages SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.plans SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.reseller_settings SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.theme_settings SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.tutorials SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
END $$;