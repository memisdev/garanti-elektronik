"use client";

import { useState, useEffect } from "react";
import { fetchSiteSettings, siteSettingsDefaults, type SiteSettings } from "@/lib/queries/site-settings";

export type { SiteSettings };

let cached: SiteSettings | null = null;
let fetching: Promise<SiteSettings> | null = null;

export function useSiteSettings(): { settings: SiteSettings; loading: boolean } {
  const [settings, setSettings] = useState<SiteSettings>(cached || siteSettingsDefaults);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) {
      setSettings(cached);
      setLoading(false);
      return;
    }

    if (!fetching) {
      fetching = fetchSiteSettings().then((s) => {
        cached = s;
        return s;
      });
    }

    fetching.then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
