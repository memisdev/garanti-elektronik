import { useState, useEffect } from "react";
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

const defaults: SiteSettings = {
  site_title: siteConfig.name,
  site_subtitle: siteConfig.description,
  whatsapp_number: siteConfig.whatsapp.number,
  contact_phone: siteConfig.contact.phone,
  contact_email: siteConfig.contact.email,
  contact_address: siteConfig.contact.address,
  working_hours: siteConfig.contact.workingHours,
};

let cached: SiteSettings | null = null;
let fetching: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  const { data } = await supabase.from("site_settings").select("key, value");
  const settings = { ...defaults };
  if (data) {
    for (const row of data) {
      if (row.key in settings && row.value) {
        (settings as Record<string, string>)[row.key] = row.value;
      }
    }
  }
  cached = settings;
  return settings;
}

export function useSiteSettings(): { settings: SiteSettings; loading: boolean } {
  const [settings, setSettings] = useState<SiteSettings>(cached || defaults);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) {
      setSettings(cached);
      setLoading(false);
      return;
    }

    if (!fetching) {
      fetching = fetchSettings();
    }

    fetching.then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
