
-- Adicionar configurações para nome do site e logotipo
INSERT INTO admin_settings (key, value) VALUES 
('site_name', '"Wapp TV"'),
('site_logo_url', '""')
ON CONFLICT (key) DO NOTHING;

-- Criar bucket para armazenar logos (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir que qualquer pessoa veja os logos
CREATE POLICY "Anyone can view logos" ON storage.objects
FOR SELECT USING (bucket_id = 'logos');

-- Política para permitir que usuários autenticados façam upload de logos
CREATE POLICY "Authenticated users can upload logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'logos' 
  AND auth.uid() IS NOT NULL
);

-- Política para permitir que usuários autenticados deletem logos
CREATE POLICY "Authenticated users can delete logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'logos' 
  AND auth.uid() IS NOT NULL
);
