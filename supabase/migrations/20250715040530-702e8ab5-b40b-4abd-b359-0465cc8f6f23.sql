-- Fix theme settings with proper HSL colors and correct active theme
-- First deactivate all themes
UPDATE theme_settings SET is_active = false;

-- Update Verde (Atual) theme with correct green HSL colors and set as active
UPDATE theme_settings 
SET 
  primary_color = '142 69% 13%',  -- Dark green
  secondary_color = '142 76% 36%', -- Medium green  
  accent_color = '142 84% 47%',   -- Bright green
  krator_primary_color = '142 76% 36%',
  krator_secondary_color = '142 84% 47%',
  is_active = true
WHERE slug = 'green';

-- Update Azul Oceano with proper blue HSL colors
UPDATE theme_settings 
SET 
  primary_color = '217 91% 60%',  -- Ocean blue
  secondary_color = '213 94% 68%', -- Light blue
  accent_color = '210 100% 76%',  -- Sky blue
  krator_primary_color = '217 91% 60%',
  krator_secondary_color = '213 94% 68%'
WHERE slug = 'blue';

-- Update Amarelo Dourado with proper yellow/gold HSL colors  
UPDATE theme_settings 
SET 
  primary_color = '43 96% 56%',   -- Golden yellow
  secondary_color = '45 93% 47%', -- Deep gold
  accent_color = '48 100% 67%',   -- Bright yellow
  krator_primary_color = '43 96% 56%',
  krator_secondary_color = '45 93% 47%'
WHERE slug = 'yellow';

-- Update Laranja Vibrante with proper orange HSL colors
UPDATE theme_settings 
SET 
  primary_color = '21 90% 48%',   -- Deep orange
  secondary_color = '24 95% 53%', -- Bright orange  
  accent_color = '31 81% 61%',    -- Light orange
  krator_primary_color = '21 90% 48%',
  krator_secondary_color = '24 95% 53%'
WHERE slug = 'orange';

-- Update Roxo Elegante with proper purple HSL colors
UPDATE theme_settings 
SET 
  primary_color = '271 81% 56%',  -- Deep purple
  secondary_color = '270 95% 65%', -- Bright purple
  accent_color = '266 85% 78%',   -- Light purple
  krator_primary_color = '271 81% 56%',
  krator_secondary_color = '270 95% 65%'
WHERE slug = 'purple';