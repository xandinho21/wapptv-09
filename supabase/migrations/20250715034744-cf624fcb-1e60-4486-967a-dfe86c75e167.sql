-- Create theme_settings table for storing theme configurations
CREATE TABLE public.theme_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  krator_primary_color TEXT NOT NULL,
  krator_secondary_color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for theme_settings
CREATE POLICY "Theme settings are viewable by everyone" 
ON public.theme_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify theme settings" 
ON public.theme_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_theme_settings_updated_at
BEFORE UPDATE ON public.theme_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default themes
INSERT INTO public.theme_settings (name, slug, is_active, primary_color, secondary_color, accent_color, krator_primary_color, krator_secondary_color) VALUES
('Verde (Atual)', 'green', true, '142 69 133', '22 163 74', '34 197 94', '168 85 247', '147 51 234'),
('Amarelo Dourado', 'yellow', false, '245 158 11', '234 179 8', '251 191 36', '239 68 68', '220 38 38'),
('Laranja Vibrante', 'orange', false, '234 88 12', '249 115 22', '251 146 60', '59 130 246', '37 99 235'),
('Roxo Elegante', 'purple', false, '147 51 234', '168 85 247', '196 181 253', '34 197 94', '22 163 74'),
('Azul Oceano', 'blue', false, '37 99 235', '59 130 246', '96 165 250', '245 158 11', '234 179 8');