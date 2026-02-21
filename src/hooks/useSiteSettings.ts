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
    let mounted = true;

    if (cached) {
      setSettings(cached);
      setLoading(false);
      return;
    }

    if (!fetching) {
      fetching = fetchSiteSettings()
        .then((s) => {
          cached = s;
          return s;
        })
        .catch((err) => {
          console.error("Failed to fetch site settings:", err);
          fetching = null; // Reset so next mount retries
          return siteSettingsDefaults;
        });
    }

    fetching.then((s) => {
      if (mounted) {
        setSettings(s);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, []);

  return { settings, loading };
}
