-- First, deactivate all themes
UPDATE theme_settings SET is_active = false;

-- Activate Verde (Atual) as the main theme
UPDATE theme_settings 
SET is_active = true 
WHERE slug = 'green';