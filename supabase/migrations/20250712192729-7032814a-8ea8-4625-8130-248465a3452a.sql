-- Add new admin settings for editable site content

-- Hero section settings
INSERT INTO admin_settings (key, value) VALUES 
('hero_title', '"Experimente o {siteName} do Streaming"'),
('hero_subtitle', '"Entretenimento de qualidade com tecnologia avançada. Desfrute de milhares de canais, filmes e séries com a melhor qualidade de streaming."'),
('hero_button_text', '"Ver Planos"'),
('hero_price_text', '"A partir de"'),
('hero_initial_price', '"R$ 25,00"'),
('hero_card1_title', '"Streaming"'),
('hero_card1_subtitle', '"Qualidade Premium"'),
('hero_card2_title', '"Suporte"'),
('hero_card2_subtitle', '"Pelo Whatsapp"'),
('hero_card3_title', '"15.000+"'),
('hero_card3_subtitle', '"Conteúdos Disponíveis"');

-- Trial section settings
INSERT INTO admin_settings (key, value) VALUES 
('trial_title', '"Experimente Antes de Comprar"'),
('trial_subtitle', '"Teste nossa plataforma gratuitamente por 4 horas e veja a qualidade do nosso serviço"');

-- Krator section settings
INSERT INTO admin_settings (key, value) VALUES 
('krator_main_title', '"Conheça o Novo Sistema {highlight}Krator{/highlight}"'),
('krator_main_subtitle', '"Tecnologia revolucionária que transforma sua experiência de entretenimento"'),
('krator_what_title', '"O que é o Krator?"'),
('krator_description', '"O Krator é nosso sistema proprietário de streaming que garante a melhor qualidade de imagem, estabilidade de conexão e experiência de usuário incomparável. Desenvolvido especialmente para oferecer entretenimento sem interrupções."'),
('krator_features', '["Streaming em tempo real otimizado", "Qualidade adaptativa automática", "Cache inteligente para maior velocidade", "Interface intuitiva e responsiva"]'),
('krator_performance_title', '"Performance Superior"'),
('krator_performance_text', '"Velocidade de carregamento 3x mais rápida comparado aos sistemas tradicionais"'),
('krator_stability_title', '"Estabilidade Garantida"'),
('krator_stability_text', '"99.9% de uptime com servidores redundantes para máxima disponibilidade"'),
('krator_quality_title', '"Qualidade Adaptativa"'),
('krator_quality_text', '"Ajuste automático da qualidade baseado na sua conexão para melhor experiência"'),
('krator_plan_section_title', '"Plano com Sistema Krator"'),
('krator_plan_name', '"Krator 1 Tela"'),
('krator_plan_features', '["1 Tela simultânea", "Sistema Krator incluído", "Alta qualidade", "Streaming otimizado", "Suporte via whatsapp"]'),
('krator_trial_title', '"Teste Grátis"'),
('krator_trial_duration', '"1 Hora"'),
('krator_trial_subtitle', '"Sistema Krator"'),
('krator_trial_description', '"Experimente o sistema Krator gratuitamente e veja a diferença na qualidade do streaming."'),
('krator_trial_feature', '"Acesso completo por 1 hora"');

-- Reseller section settings
INSERT INTO admin_settings (key, value) VALUES 
('reseller_title', '"Seja um Revendedor {siteName}"'),
('reseller_subtitle', '"Faça parte da nossa rede de revendedores e tenha uma fonte extra de renda vendendo nossos produtos com excelente suporte e comissões atrativas."'),
('reseller_support_title', '"Suporte Completo"'),
('reseller_support_text', '"Oferecemos suporte técnico e comercial para você e seus clientes"'),
('reseller_commission_title', '"Comissões Atrativas"'),
('reseller_commission_text', '"Ganhe comissões competitivas em cada venda realizada"'),
('reseller_quality_title', '"Produtos de Qualidade"'),
('reseller_quality_text', '"Venda produtos testados e aprovados por milhares de clientes"'),
('reseller_price_table_title', '"Tabela de Preços para Revendedores"'),
('reseller_credits_text', '"créditos"'),
('reseller_per_credit_text', '"por crédito"');

-- Footer settings
INSERT INTO admin_settings (key, value) VALUES 
('footer_company_name', '"Wapp TV"'),
('footer_company_description', '"A melhor experiência em streaming com tecnologia avançada. Entretenimento de qualidade para toda a família."'),
('footer_copyright', '"© 2025 Wapp TV. Todos os direitos reservados."'),
('footer_links_title', '"Links Úteis"'),
('footer_contact_title', '"Contato"'),
('footer_link_inicio', '"Início"'),
('footer_link_planos', '"Planos"'),
('footer_link_krator', '"Sistema Krator"'),
('footer_link_support', '"Suporte Técnico"'),
('footer_whatsapp_button', '"Falar no WhatsApp"'),
('footer_activation_text', '"⚡ Ativação imediata"'),
('footer_social_title', '"Redes Sociais"'),
('footer_tagline', '"Wapp TV - Transformando sua experiência de entretenimento"');