import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAdmin } from '../hooks/useSupabaseAdmin';
import { usePublicDataContext } from './PublicDataContext';

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

interface AdminData {
  contacts: string[];
  resellerContacts: string[];
  messages: {
    default: string;
    krator: string;
    contact: string;
    trial4h: string;
    trial1h: string;
    reseller: string;
  };
  buttonTexts: {
    trial4h: string;
    trial1h: string;
    reseller: string;
  };
  resellerSettings: {
    showButton: boolean;
    creditPrices: {
      credits: number;
      price: string;
    }[];
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  kratorPrice: string;
  plans: Plan[];
  popularText: string;
  tutorials: {
    wapp: Tutorial[];
    krator: Tutorial[];
  };
  siteName: string;
  siteLogoUrl: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  content: {
    hero: {
      title: string;
      subtitle: string;
      buttonText: string;
      priceText: string;
      initialPrice: string;
      card1Title: string;
      card1Subtitle: string;
      card2Title: string;
      card2Subtitle: string;
      card3Title: string;
      card3Subtitle: string;
    };
    trial: {
      title: string;
      subtitle: string;
    };
    krator: {
      mainTitle: string;
      mainSubtitle: string;
      whatTitle: string;
      description: string;
      features: string[];
      performanceTitle: string;
      performanceText: string;
      stabilityTitle: string;
      stabilityText: string;
      qualityTitle: string;
      qualityText: string;
      planSectionTitle: string;
      planName: string;
      planFeatures: string[];
      trialTitle: string;
      trialDuration: string;
      trialSubtitle: string;
      trialDescription: string;
      trialFeature: string;
    };
    reseller: {
      title: string;
      subtitle: string;
      supportTitle: string;
      supportText: string;
      commissionTitle: string;
      commissionText: string;
      qualityTitle: string;
      qualityText: string;
      priceTableTitle: string;
      creditsText: string;
      perCreditText: string;
    };
    footer: {
      companyName: string;
      companyDescription: string;
      copyright: string;
      linksTitle: string;
      contactTitle: string;
      linkInicio: string;
      linkPlanos: string;
      linkKrator: string;
      linkSupport: string;
      whatsappButton: string;
      activationText: string;
      socialTitle: string;
      tagline: string;
    };
  };
}

interface SecureAdminContextType {
  isAdmin: boolean;
  adminData: AdminData;
  loading: boolean;
  updateContacts: (contacts: string[]) => void;
  updateResellerContacts: (contacts: string[]) => void;
  updateMessages: (messages: AdminData['messages']) => void;
  updateButtonTexts: (buttonTexts: AdminData['buttonTexts']) => void;
  updateResellerSettings: (settings: AdminData['resellerSettings']) => void;
  updateKratorPrice: (price: string) => void;
  updatePlans: (plans: Plan[]) => void;
  updatePopularText: (text: string) => void;
  updateTutorials: (type: 'wapp' | 'krator', tutorials: Tutorial[]) => void;
  updateSiteName: (name: string) => void;
  updateSiteLogo: (file: File) => Promise<string>;
  updateSeoSettings: (seoData: AdminData['seo']) => void;
  updateSeoImage: (file: File) => Promise<string>;
  updateContentSettings: (section: keyof AdminData['content'], data: any) => void;
  updateSocialLinks: (socialLinks: AdminData['socialLinks']) => void;
}

export const SecureAdminContext = createContext<SecureAdminContextType | undefined>(undefined);

export const useSecureAdminContext = () => {
  const context = useContext(SecureAdminContext);
  if (context === undefined) {
    throw new Error('useSecureAdminContext must be used within a SecureAdminProvider');
  }
  return context;
};

export const SecureAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: publicData, refetch } = usePublicDataContext();
  const supabaseAdmin = useSupabaseAdmin();

  // Use public data as admin data since it's the same data
  const adminData = publicData;

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setIsAdmin(userRole?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  const updateContacts = async (contacts: string[]) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateContacts(contacts);
      refetch();
    } catch (error) {
      console.error('Error updating contacts:', error);
    }
  };

  const updateResellerContacts = async (contacts: string[]) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateResellerContacts(contacts);
      refetch();
    } catch (error) {
      console.error('Error updating reseller contacts:', error);
    }
  };

  const updateMessages = async (messages: AdminData['messages']) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateMessages(messages);
      refetch();
    } catch (error) {
      console.error('Error updating messages:', error);
    }
  };

  const updateButtonTexts = async (buttonTexts: AdminData['buttonTexts']) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateButtonTexts(buttonTexts);
      refetch();
    } catch (error) {
      console.error('Error updating button texts:', error);
    }
  };

  const updateResellerSettings = async (resellerSettings: AdminData['resellerSettings']) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateResellerSettings(resellerSettings);
      refetch();
    } catch (error) {
      console.error('Error updating reseller settings:', error);
    }
  };

  const updateKratorPrice = async (kratorPrice: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateKratorPrice(kratorPrice);
      refetch();
    } catch (error) {
      console.error('Error updating krator price:', error);
    }
  };

  const updatePlans = async (plans: Plan[]) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updatePlans(plans);
      refetch();
    } catch (error) {
      console.error('Error updating plans:', error);
    }
  };

  const updatePopularText = async (popularText: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updatePopularText(popularText);
      refetch();
    } catch (error) {
      console.error('Error updating popular text:', error);
    }
  };

  const updateTutorials = async (type: 'wapp' | 'krator', tutorials: Tutorial[]) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateTutorials(type, tutorials);
      refetch();
    } catch (error) {
      console.error('Error updating tutorials:', error);
    }
  };

  const updateSiteName = async (siteName: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateSiteName(siteName);
      refetch();
    } catch (error) {
      console.error('Error updating site name:', error);
    }
  };

  const updateSiteLogo = async (file: File): Promise<string> => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      const logoUrl = await supabaseAdmin.updateSiteLogo(file);
      refetch();
      return logoUrl;
    } catch (error) {
      console.error('Error updating site logo:', error);
      throw error;
    }
  };

  const updateSeoSettings = async (seoData: AdminData['seo']) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateSeoSettings(seoData);
      refetch();
    } catch (error) {
      console.error('Error updating SEO settings:', error);
    }
  };

  const updateSeoImage = async (file: File): Promise<string> => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      const imageUrl = await supabaseAdmin.updateSeoImage(file);
      refetch();
      return imageUrl;
    } catch (error) {
      console.error('Error updating SEO image:', error);
      throw error;
    }
  };

  const updateContentSettings = async (section: keyof AdminData['content'], data: any) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateContentSettings(section, data);
      refetch();
    } catch (error) {
      console.error('Error updating content settings:', error);
    }
  };

  const updateSocialLinks = async (socialLinks: AdminData['socialLinks']) => {
    if (!isAdmin) throw new Error('Unauthorized');
    try {
      await supabaseAdmin.updateSocialLinks(socialLinks);
      refetch();
    } catch (error) {
      console.error('Error updating social links:', error);
    }
  };

  return (
    <SecureAdminContext.Provider value={{
      isAdmin,
      adminData,
      loading,
      updateContacts,
      updateResellerContacts,
      updateMessages,
      updateButtonTexts,
      updateResellerSettings,
      updateKratorPrice,
      updatePlans,
      updatePopularText,
      updateTutorials,
      updateSiteName,
      updateSiteLogo,
      updateSeoSettings,
      updateSeoImage,
      updateContentSettings,
      updateSocialLinks
    }}>
      {children}
    </SecureAdminContext.Provider>
  );
};