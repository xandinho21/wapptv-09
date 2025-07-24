import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      'https://ycvuonxjasgvbuqpxbcj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdnVvbnhqYXNndmJ1cXB4YmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTY2MzksImV4cCI6MjA2NzE3MjYzOX0.HXhuZu6ThhW9-LvsMxw7oIKEjcJ73IBLHV1CZAaOxqk'
    );

    // Fetch current SEO settings and active theme from database
    const [seoResult, themeResult] = await Promise.all([
      supabaseClient
        .from('admin_settings')
        .select('*')
        .in('key', [
          'seo_title', 'seo_description', 'seo_keywords',
          'seo_og_title', 'seo_og_description', 'seo_og_image',
          'seo_twitter_title', 'seo_twitter_description'
        ]),
      supabaseClient
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .single()
    ]);

    const { data: seoSettings, error } = seoResult;
    const { data: activeTheme, error: themeError } = themeResult;

    if (error) {
      console.error('Error fetching SEO settings:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch SEO settings' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (themeError) {
      console.error('Error fetching theme:', themeError);
    }

    // Convert array to object for easier access
    const seoData: Record<string, string> = {};
    seoSettings?.forEach(setting => {
      // Parse JSON if the value is a JSON string
      let value = setting.value;
      if (typeof value === 'string' && (value.startsWith('"') && value.endsWith('"'))) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.warn('Failed to parse JSON value for', setting.key, ':', value);
        }
      }
      seoData[setting.key] = String(value || '');
    });

    // Generate theme CSS variables
    let themeStyles = '';
    if (activeTheme) {
      themeStyles = `\n    <style>
      :root {
        --theme-primary: ${activeTheme.primary_color};
        --theme-secondary: ${activeTheme.secondary_color};
        --theme-accent: ${activeTheme.accent_color};
        --krator-primary: ${activeTheme.krator_primary_color};
        --krator-secondary: ${activeTheme.krator_secondary_color};
      }
    </style>`;
    }

    // Return the SEO data for client-side updates
    console.log('SEO Data to be applied:', seoData);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'SEO data processed successfully',
      seoData: seoData,
      theme: activeTheme
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error updating SEO HTML:', error);
    return new Response(JSON.stringify({ error: 'Failed to update SEO HTML' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});