-- Create admin settings table for general configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table for WhatsApp numbers
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  is_reseller BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for button messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create button texts table
CREATE TABLE public.button_texts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plans table
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT 'por mês',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  popular BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tutorials table
CREATE TABLE public.tutorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('wapp', 'krator')),
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reseller settings table
CREATE TABLE public.reseller_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  show_button BOOLEAN NOT NULL DEFAULT true,
  credit_prices JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.button_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (landing page needs this data)
-- Admin settings - public read, admin write
CREATE POLICY "Admin settings are viewable by everyone" 
ON public.admin_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify admin settings" 
ON public.admin_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Contacts - public read, admin write
CREATE POLICY "Contacts are viewable by everyone" 
ON public.contacts 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify contacts" 
ON public.contacts 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Messages - public read, admin write
CREATE POLICY "Messages are viewable by everyone" 
ON public.messages 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify messages" 
ON public.messages 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Button texts - public read, admin write
CREATE POLICY "Button texts are viewable by everyone" 
ON public.button_texts 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify button texts" 
ON public.button_texts 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Plans - public read, admin write
CREATE POLICY "Plans are viewable by everyone" 
ON public.plans 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify plans" 
ON public.plans 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Tutorials - public read, admin write
CREATE POLICY "Tutorials are viewable by everyone" 
ON public.tutorials 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify tutorials" 
ON public.tutorials 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Reseller settings - public read, admin write
CREATE POLICY "Reseller settings are viewable by everyone" 
ON public.reseller_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can modify reseller settings" 
ON public.reseller_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_button_texts_updated_at
  BEFORE UPDATE ON public.button_texts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at
  BEFORE UPDATE ON public.tutorials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reseller_settings_updated_at
  BEFORE UPDATE ON public.reseller_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
-- Insert default contacts
INSERT INTO public.contacts (phone_number, is_reseller) VALUES 
('+5519993075627', false),
('+5519995753398', false),
('+5519993075627', true);

-- Insert default messages
INSERT INTO public.messages (type, content) VALUES 
('default', 'Olá! Gostaria de contratar um plano da Wapp TV. Podem me ajudar?'),
('krator', 'Olá! Gostaria de contratar um plano da Wapp TV com o sistema Krator. Podem me ajudar?'),
('contact', 'Olá! Gostaria de mais informações sobre a Wapp TV.'),
('trial4h', 'Olá! Gostaria de solicitar um teste grátis de 4 horas da Wapp TV. Podem me ajudar?'),
('trial1h', 'Olá! Gostaria de solicitar um teste grátis de 1 hora do sistema Krator. Podem me ajudar?'),
('reseller', 'Olá! Gostaria de informações sobre como me tornar um revendedor da Wapp TV. Podem me ajudar?');

-- Insert default button texts
INSERT INTO public.button_texts (key, text) VALUES 
('trial4h', 'Teste Grátis 4h'),
('trial1h', 'Teste Grátis 1h'),
('reseller', 'Quero ser um revendedor');

-- Insert default admin settings
INSERT INTO public.admin_settings (key, value) VALUES 
('krator_price', '"R$ 25,00"'),
('popular_text', '"MAIS POPULAR"');

-- Insert default plans
INSERT INTO public.plans (name, price, period, features, popular, sort_order) VALUES 
('Plano 1 Tela', 'R$ 25,00', 'por mês', '["1 Tela simultânea", "Alta qualidade", "Todos os canais", "Filmes e séries", "Suporte via whatsapp"]', false, 1),
('Plano 2 Telas', 'R$ 35,00', 'por mês', '["2 Telas simultâneas", "Alta qualidade", "Todos os canais", "Filmes e séries", "Suporte via whatsapp"]', true, 2),
('Plano 3 Telas', 'R$ 45,00', 'por mês', '["3 Telas simultâneas", "Alta qualidade", "Todos os canais", "Filmes e séries", "Suporte via whatsapp"]', false, 3);

-- Insert default tutorials
INSERT INTO public.tutorials (type, title, image, link, sort_order) VALUES 
('wapp', 'Como configurar sua TV', '/placeholder.svg', 'https://example.com/tutorial1', 1),
('wapp', 'Instalação do aplicativo', '/placeholder.svg', 'https://example.com/tutorial2', 2),
('krator', 'Setup inicial Krator', '/placeholder.svg', 'https://example.com/krator1', 1);

-- Insert default reseller settings
INSERT INTO public.reseller_settings (show_button, credit_prices) VALUES 
(true, '[
  {"credits": 10, "price": "R$ 11,00"},
  {"credits": 30, "price": "R$ 10,00"},
  {"credits": 50, "price": "R$ 8,00"},
  {"credits": 100, "price": "R$ 7,00"},
  {"credits": 500, "price": "R$ 6,00"}
]');