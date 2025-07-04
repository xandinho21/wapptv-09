
-- Create admin_settings table to store general admin configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contacts TEXT[] NOT NULL DEFAULT '{}',
  reseller_contacts TEXT[] NOT NULL DEFAULT '{}',
  messages JSONB NOT NULL DEFAULT '{}',
  button_texts JSONB NOT NULL DEFAULT '{}',
  reseller_settings JSONB NOT NULL DEFAULT '{}',
  krator_price TEXT NOT NULL DEFAULT 'R$ 25,00',
  popular_text TEXT NOT NULL DEFAULT 'MAIS POPULAR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plans table
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  popular BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tutorials table
CREATE TABLE public.tutorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  link TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wapp', 'krator')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for tutorial images
INSERT INTO storage.buckets (id, name, public) VALUES ('tutorial-images', 'tutorial-images', true);

-- Create RLS policies for storage bucket (public access for display)
CREATE POLICY "Public can view tutorial images" ON storage.objects
FOR SELECT USING (bucket_id = 'tutorial-images');

CREATE POLICY "Authenticated users can upload tutorial images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'tutorial-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tutorial images" ON storage.objects
FOR UPDATE USING (bucket_id = 'tutorial-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tutorial images" ON storage.objects
FOR DELETE USING (bucket_id = 'tutorial-images' AND auth.role() = 'authenticated');

-- Enable Row Level Security (these tables will be managed through admin interface)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

-- Create policies allowing public read access (since this is a public website)
CREATE POLICY "Anyone can view admin settings" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can view plans" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Anyone can view tutorials" ON public.tutorials FOR SELECT USING (true);

-- Admin management policies (for future admin authentication)
CREATE POLICY "Authenticated users can manage admin settings" ON public.admin_settings 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage plans" ON public.plans 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage tutorials" ON public.tutorials 
FOR ALL USING (auth.role() = 'authenticated');

-- Insert default admin settings
INSERT INTO public.admin_settings (
  contacts, 
  reseller_contacts, 
  messages, 
  button_texts, 
  reseller_settings,
  krator_price,
  popular_text
) VALUES (
  ARRAY['+5519993075627', '+5519995753398'],
  ARRAY['+5519993075627'],
  '{
    "default": "Olá! Gostaria de contratar um plano da Wapp TV. Podem me ajudar?",
    "krator": "Olá! Gostaria de contratar um plano da Wapp TV com o sistema Krator. Podem me ajudar?",
    "contact": "Olá! Gostaria de mais informações sobre a Wapp TV.",
    "trial4h": "Olá! Gostaria de solicitar um teste grátis de 4 horas da Wapp TV. Podem me ajudar?",
    "trial1h": "Olá! Gostaria de solicitar um teste grátis de 1 hora do sistema Krator. Podem me ajudar?",
    "reseller": "Olá! Gostaria de informações sobre como me tornar um revendedor da Wapp TV. Podem me ajudar?"
  }'::jsonb,
  '{
    "trial4h": "Teste Grátis 4h",
    "trial1h": "Teste Grátis 1h",
    "reseller": "Quero ser um revendedor"
  }'::jsonb,
  '{
    "showButton": true,
    "creditPrices": [
      {"credits": 10, "price": "R$ 11,00"},
      {"credits": 30, "price": "R$ 10,00"},
      {"credits": 50, "price": "R$ 8,00"},
      {"credits": 100, "price": "R$ 7,00"},
      {"credits": 500, "price": "R$ 6,00"}
    ]
  }'::jsonb,
  'R$ 25,00',
  'MAIS POPULAR'
);

-- Insert default plans
INSERT INTO public.plans (name, price, period, features, popular, display_order) VALUES 
('Plano 1 Tela', 'R$ 25,00', 'por mês', ARRAY['1 Tela simultânea', 'Alta qualidade', 'Todos os canais', 'Filmes e séries', 'Suporte via whatsapp'], false, 1),
('Plano 2 Telas', 'R$ 35,00', 'por mês', ARRAY['2 Telas simultâneas', 'Alta qualidade', 'Todos os canais', 'Filmes e séries', 'Suporte via whatsapp'], true, 2),
('Plano 3 Telas', 'R$ 45,00', 'por mês', ARRAY['3 Telas simultâneas', 'Alta qualidade', 'Todos os canais', 'Filmes e séries', 'Suporte via whatsapp'], false, 3);

-- Insert default tutorials
INSERT INTO public.tutorials (title, image_url, link, type, display_order) VALUES 
('Como configurar sua TV', '/placeholder.svg', 'https://example.com/tutorial1', 'wapp', 1),
('Instalação do aplicativo', '/placeholder.svg', 'https://example.com/tutorial2', 'wapp', 2),
('Setup inicial Krator', '/placeholder.svg', 'https://example.com/krator1', 'krator', 1);
