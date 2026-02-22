import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/config/site";

export interface SiteSettings {
  site_title: string;
  site_subtitle: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  working_hours: string;
}

export const siteSettingsDefaults: SiteSettings = {
  site_title: siteConfig.name,
  site_subtitle: siteConfig.description,
  whatsapp_number: siteConfig.whatsapp.number,
  contact_phone: siteConfig.contact.phone,
  contact_email: siteConfig.contact.email,
  contact_address: siteConfig.contact.address,
  working_hours: siteConfig.contact.workingHours,
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error) throw error;
  const settings = { ...siteSettingsDefaults };
  if (data) {
    for (const row of data) {
      if (row.key in settings && row.value) {
        (settings as Record<string, string>)[row.key] = row.value;
      }
    }
  }
  return settings;
}
