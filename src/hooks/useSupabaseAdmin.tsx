
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
      // Delete existing tutorials of this type
      await supabase.from('tutorials').delete().eq('type', type);
      
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
        await supabase.from('tutorials').insert(tutorialData);
      }
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
    updateResellerSettings
  };
};
