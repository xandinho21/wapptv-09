-- Primeiro, vamos criar o novo tenant
INSERT INTO public.tenants (name, domain, is_active)
VALUES ('4Flix', '4flixpro.top', true);

-- Agora vamos copiar todas as configurações do tenant atual para o novo tenant
-- Assumindo que existe um tenant atual (primeiro tenant na tabela)

-- Copiar admin_settings
INSERT INTO public.admin_settings (key, value, tenant_id)
SELECT key, value, (SELECT id FROM public.tenants WHERE domain = '4flixpro.top')
FROM public.admin_settings 
WHERE tenant_id IS NULL OR tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1);

-- Copiar button_texts
INSERT INTO public.button_texts (key, text, tenant_id)
SELECT key, text, (SELECT id FROM public.tenants WHERE domain = '4flixpro.top')
FROM public.button_texts 
WHERE tenant_id IS NULL OR tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1);

-- Copiar contacts
INSERT INTO public.contacts (phone_number, is_reseller, tenant_id)
SELECT phone_number, is_reseller, (SELECT id FROM public.tenants WHERE domain = '4flixpro.top')
FROM public.contacts 
WHERE tenant_id IS NULL OR tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1);

-- Copiar messages
INSERT INTO public.messages (type, content, tenant_id)
SELECT type, content, (SELECT id FROM public.tenants WHERE domain = '4flixpro.top')
FROM public.messages 
WHERE tenant_id IS NULL OR tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1);

-- Copiar plans
INSERT INTO public.plans (name, price, period, features, popular, sort_order, tenant_id)
SELECT name, price, period, features, popular, sort_order, (SELECT id FROM public.tenants WHERE domain = '4flixpro.top')
FROM public.plans 
WHERE tenant_id IS NULL OR tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1);

-- Copiar tutorials
INSERT INTO public.tutorials (title, image, link, type, sort_order, tenant_id)
SELECT title, image, link, type, sort_order, (SELECT id FROM public.tenants WHERE domain = '4flixpro.top')
FROM public.tutorials 
WHERE tenant_id IS NULL OR tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1);

-- Copiar reseller_settings
INSERT INTO public.reseller_settings (show_button, credit_prices, tenant_id)
SELECT show_button, credit_prices, (SELECT id FROM public.tenants WHERE domain = '4flixpro.top')
FROM public.reseller_settings 
WHERE tenant_id IS NULL OR tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1);

-- Copiar theme_settings (definindo como ativo para o novo tenant)
INSERT INTO public.theme_settings (
    name, slug, primary_color, secondary_color, accent_color, 
    krator_primary_color, krator_secondary_color, 
    krator_trial_button_bg_color, krator_trial_button_text_color, krator_trial_button_hover_color,
    is_active, tenant_id
)
SELECT 
    name || ' - 4Flix', 
    slug || '-4flix', 
    primary_color, secondary_color, accent_color,
    krator_primary_color, krator_secondary_color,
    krator_trial_button_bg_color, krator_trial_button_text_color, krator_trial_button_hover_color,
    true,
    (SELECT id FROM public.tenants WHERE domain = '4flixpro.top')
FROM public.theme_settings 
WHERE is_active = true AND (tenant_id IS NULL OR tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1))
LIMIT 1;

-- Criar preferência de tema para o novo tenant
INSERT INTO public.tenant_theme_preferences (tenant_id, active_theme_id)
SELECT 
    (SELECT id FROM public.tenants WHERE domain = '4flixpro.top'),
    (SELECT id FROM public.theme_settings WHERE tenant_id = (SELECT id FROM public.tenants WHERE domain = '4flixpro.top') LIMIT 1);