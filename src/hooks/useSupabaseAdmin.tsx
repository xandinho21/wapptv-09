import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  image: string;
  link: string;
}

export const useSupabaseAdmin = () => {
  // Contacts
  const updateContacts = async (contacts: string[]) => {
    try {
      // Delete existing non-reseller contacts
      await supabase.from('contacts').delete().eq('is_reseller', false);
      
      // Insert new contacts
      const contactData = contacts.map(phone => ({
        phone_number: phone,
        is_reseller: false
      }));
      
      await supabase.from('contacts').insert(contactData);
    } catch (error) {
      console.error('Error updating contacts:', error);
      throw error;
    }
  };

  const updateResellerContacts = async (contacts: string[]) => {
    try {
      // Delete existing reseller contacts
      await supabase.from('contacts').delete().eq('is_reseller', true);
      
      // Insert new reseller contacts
      const contactData = contacts.map(phone => ({
        phone_number: phone,
        is_reseller: true
      }));
      
      await supabase.from('contacts').insert(contactData);
    } catch (error) {
      console.error('Error updating reseller contacts:', error);
      throw error;
    }
  };

  // Messages
  const updateMessages = async (messages: Record<string, string>) => {
    try {
      const messageUpdates = Object.entries(messages).map(([type, content]) => ({
        type,
        content
      }));

      for (const message of messageUpdates) {
        await supabase
          .from('messages')
          .upsert(message, { onConflict: 'type' });
      }
    } catch (error) {
      console.error('Error updating messages:', error);
      throw error;
    }
  };

  // Button texts
  const updateButtonTexts = async (buttonTexts: Record<string, string>) => {
    try {
      const buttonUpdates = Object.entries(buttonTexts).map(([key, text]) => ({
        key,
        text
      }));

      for (const button of buttonUpdates) {
        await supabase
          .from('button_texts')
          .upsert(button, { onConflict: 'key' });
      }
    } catch (error) {
      console.error('Error updating button texts:', error);
      throw error;
    }
  };

  // Admin settings
  const updateKratorPrice = async (price: string) => {
    try {
      await supabase
        .from('admin_settings')
        .upsert({ key: 'krator_price', value: JSON.stringify(price) }, { onConflict: 'key' });
    } catch (error) {
      console.error('Error updating krator price:', error);
      throw error;
    }
  };

  const updatePopularText = async (text: string) => {
    try {
      await supabase
        .from('admin_settings')
        .upsert({ key: 'popular_text', value: JSON.stringify(text) }, { onConflict: 'key' });
    } catch (error) {
      console.error('Error updating popular text:', error);
      throw error;
    }
  };

  const updateSiteName = async (name: string) => {
    try {
      await supabase
        .from('admin_settings')
        .upsert({ key: 'site_name', value: JSON.stringify(name) }, { onConflict: 'key' });
    } catch (error) {
      console.error('Error updating site name:', error);
      throw error;
    }
  };

  const updateSiteLogo = async (file: File) => {
    try {
      // Delete old logo if exists
      const { data: files } = await supabase.storage.from('logos').list();
      if (files && files.length > 0) {
        await supabase.storage.from('logos').remove(files.map(f => f.name));
      }

      // Upload new logo
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Update logo URL in settings
      await supabase
        .from('admin_settings')
        .upsert({ key: 'site_logo_url', value: JSON.stringify(publicUrl) }, { onConflict: 'key' });

      return publicUrl;
    } catch (error) {
      console.error('Error updating site logo:', error);
      throw error;
    }
  };

  // Plans
  const updatePlans = async (plans: Plan[]) => {
    try {
      // Delete existing plans
      await supabase.from('plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert new plans
      const planData = plans.map((plan, index) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        period: plan.period,
        features: plan.features,
        popular: plan.popular,
        sort_order: index + 1
      }));
      
      await supabase.from('plans').insert(planData);
    } catch (error) {
      console.error('Error updating plans:', error);
      throw error;
    }
  };

  // Tutorials
  const updateTutorials = async (type: 'wapp' | 'krator', tutorials: Tutorial[]) => {
    try {
      console.log(`Atualizando tutoriais ${type}:`, tutorials);
      
      // Delete existing tutorials of this type
      const { error: deleteError } = await supabase.from('tutorials').delete().eq('type', type);
      if (deleteError) {
        console.error('Erro ao deletar tutoriais existentes:', deleteError);
        throw deleteError;
      }
      
      // Insert new tutorials
      const tutorialData = tutorials.map((tutorial, index) => ({
        id: tutorial.id,
        type,
        title: tutorial.title,
        image: tutorial.image,
        link: tutorial.link,
        sort_order: index + 1
      }));
      
      if (tutorialData.length > 0) {
        console.log('Inserindo dados:', tutorialData);
        const { error: insertError } = await supabase.from('tutorials').insert(tutorialData);
        if (insertError) {
          console.error('Erro ao inserir tutoriais:', insertError);
          throw insertError;
        }
      }
      
      console.log(`Tutoriais ${type} salvos com sucesso`);
    } catch (error) {
      console.error('Error updating tutorials:', error);
      throw error;
    }
  };

  // Reseller settings
  const updateResellerSettings = async (settings: {
    showButton: boolean;
    creditPrices: { credits: number; price: string; }[];
  }) => {
    try {
      // Delete existing reseller settings
      await supabase.from('reseller_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert new settings
      await supabase.from('reseller_settings').insert({
        show_button: settings.showButton,
        credit_prices: settings.creditPrices
      });
    } catch (error) {
      console.error('Error updating reseller settings:', error);
      throw error;
    }
  };

  // SEO settings
  const updateSeoSettings = async (seoData: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
  }) => {
    try {
      const seoUpdates = [
        { key: 'seo_title', value: JSON.stringify(seoData.title) },
        { key: 'seo_description', value: JSON.stringify(seoData.description) },
        { key: 'seo_keywords', value: JSON.stringify(seoData.keywords) },
        { key: 'seo_og_title', value: JSON.stringify(seoData.ogTitle) },
        { key: 'seo_og_description', value: JSON.stringify(seoData.ogDescription) },
        { key: 'seo_og_image', value: JSON.stringify(seoData.ogImage) },
        { key: 'seo_twitter_title', value: JSON.stringify(seoData.twitterTitle) },
        { key: 'seo_twitter_description', value: JSON.stringify(seoData.twitterDescription) }
      ];

      for (const setting of seoUpdates) {
        await supabase
          .from('admin_settings')
          .upsert(setting, { onConflict: 'key' });
      }

      // Call edge function to update index.html with new SEO data
      try {
        const { error: functionError } = await supabase.functions.invoke('update-seo-html');
        if (functionError) {
          console.error('Error calling update-seo-html function:', functionError);
        }
      } catch (functionCallError) {
        console.error('Error invoking SEO update function:', functionCallError);
        // Don't throw here as the main SEO data was saved successfully
      }
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      throw error;
    }
  };

  const updateSeoImage = async (file: File) => {
    try {
      // Delete old SEO image if exists
      const { data: files } = await supabase.storage.from('logos').list('seo/');
      if (files && files.length > 0) {
        await supabase.storage.from('logos').remove(files.map(f => `seo/${f.name}`));
      }

      // Upload new SEO image
      const fileExt = file.name.split('.').pop();
      const fileName = `seo/og-image.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Update SEO image URL in settings
      await supabase
        .from('admin_settings')
        .upsert({ key: 'seo_og_image', value: JSON.stringify(publicUrl) }, { onConflict: 'key' });

      return publicUrl;
    } catch (error) {
      console.error('Error updating SEO image:', error);
      throw error;
    }
  };

  const updateContentSettings = async (section: string, data: any) => {
    try {
      const updates = [];
      
      // Convert section data to individual admin_settings entries
      for (const [key, value] of Object.entries(data)) {
        updates.push({
          key: `${section}_${key}`,
          value: JSON.stringify(value)
        });
      }

      const { error } = await supabase
        .from('admin_settings')
        .upsert(updates, {
          onConflict: 'key'
        });

      if (error) {
        console.error('Error updating content settings:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating content settings:', error);
      throw error;
    }
  };

  // Social Links
  const updateSocialLinks = async (socialLinks: { facebook: string; instagram: string; youtube: string }) => {
    try {
      await supabase
        .from('admin_settings')
        .upsert({
          key: 'social_links',
          value: socialLinks
        }, { onConflict: 'key' });
    } catch (error) {
      console.error('Error updating social links:', error);
      throw error;
    }
  };

  return {
    updateContacts,
    updateResellerContacts,
    updateMessages,
    updateButtonTexts,
    updateKratorPrice,
    updatePopularText,
    updateSiteName,
    updateSiteLogo,
    updatePlans,
    updateTutorials,
    updateResellerSettings,
    updateSeoSettings,
    updateSeoImage,
    updateContentSettings,
    updateSocialLinks
  };
};
