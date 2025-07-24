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

    // Since we can't write to the deployment files, return the SEO data for client-side updates
    console.log('SEO Data to be applied:', seoData);
    
    // For now, we'll return success but not actually write the file
    // The client will handle meta tag updates dynamically
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'SEO data processed successfully',
      seoData: seoData,
      theme: activeTheme
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

    // Read current index.html (commented out as we can't modify deployment files)
    // const indexPath = './index.html';
    // let htmlContent: string;
    
    // try {
    //   htmlContent = await Deno.readTextFile(indexPath);
    // } catch {
      // If file doesn't exist, create basic structure
      htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wapp TV - O Melhor da IPTV</title>
    <meta name="description" content="Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator." />
    <meta name="author" content="Wapp TV" />

    <meta property="og:title" content="Wapp TV - O Melhor da IPTV" />
    <meta property="og:description" content="Experimente o melhor da IPTV com Wapp TV. Planos a partir de R$ 25,00 com o novo sistema Krator." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@wapptv" />
    <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    }

    // Update meta tags with new SEO data
    let updatedHtml = htmlContent;

    // Update title
    if (seoData.seo_title) {
      updatedHtml = updatedHtml.replace(
        /<title>.*?<\/title>/i,
        `<title>${seoData.seo_title}</title>`
      );
    }

    // Update description
    if (seoData.seo_description) {
      updatedHtml = updatedHtml.replace(
        /<meta name="description" content=".*?"/i,
        `<meta name="description" content="${seoData.seo_description}"`
      );
    }

    // Update keywords if provided
    if (seoData.seo_keywords) {
      if (updatedHtml.includes('<meta name="keywords"')) {
        updatedHtml = updatedHtml.replace(
          /<meta name="keywords" content=".*?"/i,
          `<meta name="keywords" content="${seoData.seo_keywords}"`
        );
      } else {
        // Add keywords meta tag after description
        updatedHtml = updatedHtml.replace(
          /(<meta name="description"[^>]*>)/i,
          `$1\n    <meta name="keywords" content="${seoData.seo_keywords}" />`
        );
      }
    }

    // Update Open Graph title
    if (seoData.seo_og_title) {
      updatedHtml = updatedHtml.replace(
        /<meta property="og:title" content=".*?"/i,
        `<meta property="og:title" content="${seoData.seo_og_title}"`
      );
    }

    // Update Open Graph description
    if (seoData.seo_og_description) {
      updatedHtml = updatedHtml.replace(
        /<meta property="og:description" content=".*?"/i,
        `<meta property="og:description" content="${seoData.seo_og_description}"`
      );
    }

    // Update Open Graph image
    if (seoData.seo_og_image) {
      updatedHtml = updatedHtml.replace(
        /<meta property="og:image" content=".*?"/i,
        `<meta property="og:image" content="${seoData.seo_og_image}"`
      );
    }

    // Update Twitter title
    if (seoData.seo_twitter_title) {
      if (updatedHtml.includes('<meta name="twitter:title"')) {
        updatedHtml = updatedHtml.replace(
          /<meta name="twitter:title" content=".*?"/i,
          `<meta name="twitter:title" content="${seoData.seo_twitter_title}"`
        );
      } else {
        // Add twitter title after twitter:site
        updatedHtml = updatedHtml.replace(
          /(<meta name="twitter:site"[^>]*>)/i,
          `$1\n    <meta name="twitter:title" content="${seoData.seo_twitter_title}" />`
        );
      }
    }

    // Update Twitter description
    if (seoData.seo_twitter_description) {
      if (updatedHtml.includes('<meta name="twitter:description"')) {
        updatedHtml = updatedHtml.replace(
          /<meta name="twitter:description" content=".*?"/i,
          `<meta name="twitter:description" content="${seoData.seo_twitter_description}"`
        );
      } else {
        // Add twitter description after twitter title or site
        const insertAfter = updatedHtml.includes('<meta name="twitter:title"') 
          ? /(<meta name="twitter:title"[^>]*>)/i 
          : /(<meta name="twitter:site"[^>]*>)/i;
        
        updatedHtml = updatedHtml.replace(
          insertAfter,
          `$1\n    <meta name="twitter:description" content="${seoData.seo_twitter_description}" />`
        );
      }
    }

    // Update Twitter image
    if (seoData.seo_og_image) {
      updatedHtml = updatedHtml.replace(
        /<meta name="twitter:image" content=".*?"/i,
        `<meta name="twitter:image" content="${seoData.seo_og_image}"`
      );
    }

    // Add theme styles to head if theme is available
    if (themeStyles) {
      // Add theme styles after favicon but before closing head tag
      const faviconRegex = /(<link[^>]*rel="icon"[^>]*>)/i;
      const headCloseRegex = /(<\/head>)/i;
      
      if (faviconRegex.test(updatedHtml)) {
        updatedHtml = updatedHtml.replace(faviconRegex, `$1${themeStyles}`);
      } else if (headCloseRegex.test(updatedHtml)) {
        updatedHtml = updatedHtml.replace(headCloseRegex, `${themeStyles}\n  $1`);
      }
    }

  } catch (error) {
    console.error('Error updating SEO HTML:', error);
    return new Response(JSON.stringify({ error: 'Failed to update SEO HTML' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});