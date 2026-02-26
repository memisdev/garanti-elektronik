import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { siteConfig } from "@/config/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at");

  const { data: brands } = await supabase
    .from("brands")
    .select("slug, updated_at");

  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteConfig.url}/urunler`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/parca-bulucu`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/hakkimizda`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/sss`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/kargo-takip`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/garanti-iade`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/gizlilik-kvkk`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/cerez-politikasi`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${siteConfig.url}/urun/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const brandPages: MetadataRoute.Sitemap = (brands ?? []).map((b) => ({
    url: `${siteConfig.url}/marka/${b.slug}`,
    lastModified: b.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...brandPages];
}
