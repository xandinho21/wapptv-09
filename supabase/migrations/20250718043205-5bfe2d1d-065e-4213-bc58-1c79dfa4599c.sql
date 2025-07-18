-- Atualizar o nome do tenant existente para "4Flix"
UPDATE public.tenants 
SET name = '4Flix' 
WHERE domain = '4flixpro.top';

-- Verificar se precisa copiar dados (só copia se não existir dados para este tenant)
-- Copiar admin_settings se não existir
INSERT INTO public.admin_settings (key, value, tenant_id)
SELECT key, value, '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
FROM public.admin_settings 
WHERE tenant_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM public.admin_settings 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
);

-- Copiar button_texts se não existir
INSERT INTO public.button_texts (key, text, tenant_id)
SELECT key, text, '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
FROM public.button_texts 
WHERE tenant_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM public.button_texts 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
);

-- Copiar contacts se não existir
INSERT INTO public.contacts (phone_number, is_reseller, tenant_id)
SELECT phone_number, is_reseller, '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
FROM public.contacts 
WHERE tenant_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM public.contacts 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
);

-- Copiar messages se não existir
INSERT INTO public.messages (type, content, tenant_id)
SELECT type, content, '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
FROM public.messages 
WHERE tenant_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM public.messages 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
);

-- Copiar plans se não existir
INSERT INTO public.plans (name, price, period, features, popular, sort_order, tenant_id)
SELECT name, price, period, features, popular, sort_order, '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
FROM public.plans 
WHERE tenant_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM public.plans 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
);

-- Copiar tutorials se não existir
INSERT INTO public.tutorials (title, image, link, type, sort_order, tenant_id)
SELECT title, image, link, type, sort_order, '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
FROM public.tutorials 
WHERE tenant_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM public.tutorials 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
);

-- Copiar reseller_settings se não existir
INSERT INTO public.reseller_settings (show_button, credit_prices, tenant_id)
SELECT show_button, credit_prices, '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
FROM public.reseller_settings 
WHERE tenant_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM public.reseller_settings 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
);

-- Copiar theme_settings se não existir tema para este tenant
INSERT INTO public.theme_settings (
    name, slug, primary_color, secondary_color, accent_color, 
    krator_primary_color, krator_secondary_color, 
    krator_trial_button_bg_color, krator_trial_button_text_color, krator_trial_button_hover_color,
    is_active, tenant_id
)
SELECT 
    'Tema 4Flix', 
    'tema-4flix', 
    primary_color, secondary_color, accent_color,
    krator_primary_color, krator_secondary_color,
    krator_trial_button_bg_color, krator_trial_button_text_color, krator_trial_button_hover_color,
    true,
    '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
FROM public.theme_settings 
WHERE is_active = true AND tenant_id IS NULL
AND NOT EXISTS (
    SELECT 1 FROM public.theme_settings 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
)
LIMIT 1;

-- Criar preferência de tema se não existir
INSERT INTO public.tenant_theme_preferences (tenant_id, active_theme_id)
SELECT 
    '8063cf8f-452e-4bd1-b1dc-a8ee929da77a',
    (SELECT id FROM public.theme_settings WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.tenant_theme_preferences 
    WHERE tenant_id = '8063cf8f-452e-4bd1-b1dc-a8ee929da77a'
);