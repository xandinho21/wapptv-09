
-- First, let's register the current development domain as a tenant
INSERT INTO public.tenants (name, domain, is_active)
VALUES ('Development Site', 'localhost', true)
ON CONFLICT (domain) DO NOTHING;

-- Get the tenant ID for localhost (we'll need this for the next inserts)
-- Let's also insert some initial data for the localhost tenant

-- Insert initial messages for localhost tenant
INSERT INTO public.messages (type, content, tenant_id)
SELECT 'default', 'Olá! Estou interessado em seus serviços de IPTV. Poderia me enviar mais informações?', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (type, tenant_id) DO NOTHING;

INSERT INTO public.messages (type, content, tenant_id)
SELECT 'krator', 'Olá! Gostaria de saber mais sobre o plano Krator. Pode me ajudar?', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (type, tenant_id) DO NOTHING;

INSERT INTO public.messages (type, content, tenant_id)
SELECT 'contact', 'Olá! Gostaria de entrar em contato para mais informações.', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (type, tenant_id) DO NOTHING;

INSERT INTO public.messages (type, content, tenant_id)
SELECT 'trial4h', 'Olá! Gostaria de testar o serviço por 4 horas. Como proceder?', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (type, tenant_id) DO NOTHING;

INSERT INTO public.messages (type, content, tenant_id)
SELECT 'trial1h', 'Olá! Gostaria de testar o plano Krator por 1 hora. É possível?', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (type, tenant_id) DO NOTHING;

INSERT INTO public.messages (type, content, tenant_id)
SELECT 'reseller', 'Olá! Tenho interesse em ser revendedor. Poderia me passar mais detalhes?', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (type, tenant_id) DO NOTHING;

-- Insert initial button texts for localhost tenant
INSERT INTO public.button_texts (key, text, tenant_id)
SELECT 'trial4h', 'Teste 4 Horas Grátis', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (key, tenant_id) DO NOTHING;

INSERT INTO public.button_texts (key, text, tenant_id)
SELECT 'trial1h', 'Teste 1 Hora Grátis', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (key, tenant_id) DO NOTHING;

INSERT INTO public.button_texts (key, text, tenant_id)
SELECT 'reseller', 'Seja Revendedor', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (key, tenant_id) DO NOTHING;

-- Insert initial reseller settings for localhost tenant
INSERT INTO public.reseller_settings (show_button, credit_prices, tenant_id)
SELECT true, '[]'::jsonb, t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT DO NOTHING;

-- Insert initial admin settings for localhost tenant
INSERT INTO public.admin_settings (key, value, tenant_id)
SELECT 'site_name', '"Wapp TV"', t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (key, tenant_id) DO NOTHING;

INSERT INTO public.admin_settings (key, value, tenant_id)
SELECT 'social_links', '{"facebook": "", "instagram": "", "youtube": ""}'::jsonb, t.id
FROM public.tenants t WHERE t.domain = 'localhost'
ON CONFLICT (key, tenant_id) DO NOTHING;
