
-- Insert default SEO settings into admin_settings table
INSERT INTO admin_settings (key, value) VALUES 
('seo_title', '"Wapp TV - O Melhor da IPTV"'),
('seo_description', '"Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator. Teste grátis disponível!"'),
('seo_keywords', '"IPTV, Wapp TV, Krator, streaming, televisão online, planos IPTV, teste grátis"'),
('seo_og_title', '"Wapp TV - O Melhor da IPTV"'),
('seo_og_description', '"Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator."'),
('seo_og_image', '""'),
('seo_twitter_title', '"Wapp TV - O Melhor da IPTV"'),
('seo_twitter_description', '"Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator."')
ON CONFLICT (key) DO NOTHING;
