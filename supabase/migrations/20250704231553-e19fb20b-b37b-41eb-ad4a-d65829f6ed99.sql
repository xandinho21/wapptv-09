
-- Create table for admin configurations
CREATE TABLE public.admin_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contacts TEXT[] DEFAULT '{}',
  reseller_contacts TEXT[] DEFAULT '{}',
  messages JSONB DEFAULT '{
    "default": "Olá! Gostaria de contratar um plano da Wapp TV. Podem me ajudar?",
    "krator": "Olá! Gostaria de contratar um plano da Wapp TV com o sistema Krator. Podem me ajudar?",
    "contact": "Olá! Gostaria de mais informações sobre a Wapp TV.",
    "trial4h": "Olá! Gostaria de solicitar um teste grátis de 4 horas da Wapp TV. Podem me ajudar?",
    "trial1h": "Olá! Gostaria de solicitar um teste grátis de 1 hora do sistema Krator. Podem me ajudar?",
    "reseller": "Olá! Gostaria de informações sobre como me tornar um revendedor da Wapp TV. Podem me ajudar?"
  }',
  button_texts JSONB DEFAULT '{
    "trial4h": "Teste Grátis 4h",
    "trial1h": "Teste Grátis 1h",
    "reseller": "Quero ser um revendedor"
  }',
  reseller_settings JSONB DEFAULT '{
    "showButton": true,
    "creditPrices": [
      {"credits": 10, "price": "R$ 11,00"},
      {"credits": 30, "price": "R$ 10,00"},
      {"credits": 50, "price": "R$ 8,00"},
      {"credits": 100, "price": "R$ 7,00"},
      {"credits": 500, "price": "R$ 6,00"}
    ]
  }',
  krator_price TEXT DEFAULT 'R$ 25,00',
  popular_text TEXT DEFAULT 'MAIS POPULAR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for plans
CREATE TABLE public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT DEFAULT 'por mês',
  features TEXT[] DEFAULT '{}',
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for tutorials
CREATE TABLE public.tutorials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image TEXT DEFAULT '/placeholder.svg',
  link TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wapp', 'krator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_configs
CREATE POLICY "Users can view their own admin configs" 
  ON public.admin_configs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own admin configs" 
  ON public.admin_configs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own admin configs" 
  ON public.admin_configs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policies for plans
CREATE POLICY "Users can view their own plans" 
  ON public.plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans" 
  ON public.plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans" 
  ON public.plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans" 
  ON public.plans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for tutorials
CREATE POLICY "Users can view their own tutorials" 
  ON public.tutorials 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tutorials" 
  ON public.tutorials 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tutorials" 
  ON public.tutorials 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tutorials" 
  ON public.tutorials 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Insert default data for admin configs
INSERT INTO public.admin_configs (user_id, contacts, reseller_contacts)
SELECT id, ARRAY['+5519993075627', '+5519995753398'], ARRAY['+5519993075627']
FROM auth.users
ON CONFLICT DO NOTHING;

-- Insert default plans
INSERT INTO public.plans (user_id, name, price, features, popular)
SELECT 
  id,
  unnest(ARRAY['Plano 1 Tela', 'Plano 2 Telas', 'Plano 3 Telas']),
  unnest(ARRAY['R$ 25,00', 'R$ 35,00', 'R$ 45,00']),
  unnest(ARRAY[
    ARRAY['1 Tela simultânea', 'Alta qualidade', 'Todos os canais', 'Filmes e séries', 'Suporte via whatsapp'],
    ARRAY['2 Telas simultâneas', 'Alta qualidade', 'Todos os canais', 'Filmes e séries', 'Suporte via whatsapp'],
    ARRAY['3 Telas simultâneas', 'Alta qualidade', 'Todos os canais', 'Filmes e séries', 'Suporte via whatsapp']
  ]),
  unnest(ARRAY[false, true, false])
FROM auth.users
ON CONFLICT DO NOTHING;

-- Insert default tutorials
INSERT INTO public.tutorials (user_id, title, link, type)
SELECT 
  id,
  unnest(ARRAY['Como configurar sua TV', 'Instalação do aplicativo', 'Setup inicial Krator']),
  unnest(ARRAY['https://example.com/tutorial1', 'https://example.com/tutorial2', 'https://example.com/krator1']),
  unnest(ARRAY['wapp', 'wapp', 'krator'])
FROM auth.users
ON CONFLICT DO NOTHING;
