-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing admin-related RLS policies to use role-based access
DROP POLICY IF EXISTS "Only authenticated users can modify admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Only authenticated users can modify button texts" ON public.button_texts;
DROP POLICY IF EXISTS "Only authenticated users can modify contacts" ON public.contacts;
DROP POLICY IF EXISTS "Only authenticated users can modify messages" ON public.messages;
DROP POLICY IF EXISTS "Only authenticated users can modify plans" ON public.plans;
DROP POLICY IF EXISTS "Only authenticated users can modify reseller settings" ON public.reseller_settings;
DROP POLICY IF EXISTS "Only authenticated users can modify tenant theme preferences" ON public.tenant_theme_preferences;
DROP POLICY IF EXISTS "Only authenticated users can modify tenants" ON public.tenants;
DROP POLICY IF EXISTS "Only authenticated users can modify theme settings" ON public.theme_settings;
DROP POLICY IF EXISTS "Only authenticated users can modify tutorials" ON public.tutorials;

-- Create new admin-only policies
CREATE POLICY "Only admins can modify admin settings" 
ON public.admin_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify button texts" 
ON public.button_texts 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify contacts" 
ON public.contacts 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify messages" 
ON public.messages 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify plans" 
ON public.plans 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify reseller settings" 
ON public.reseller_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify tenant theme preferences" 
ON public.tenant_theme_preferences 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify tenants" 
ON public.tenants 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify theme settings" 
ON public.theme_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can modify tutorials" 
ON public.tutorials 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));