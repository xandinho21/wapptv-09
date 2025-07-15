-- Add columns for Krator trial button customization
ALTER TABLE public.theme_settings 
ADD COLUMN krator_trial_button_bg_color TEXT NOT NULL DEFAULT '147 51 234',
ADD COLUMN krator_trial_button_text_color TEXT NOT NULL DEFAULT '255 255 255', 
ADD COLUMN krator_trial_button_hover_color TEXT NOT NULL DEFAULT '147 51 234';