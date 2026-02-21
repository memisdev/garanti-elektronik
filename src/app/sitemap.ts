import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at");

  const { data: brands } = await supabase
    .from("brands")
    .select("slug, updated_at");

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://garantielektronik.com", changeFrequency: "weekly", priority: 1.0 },
    { url: "https://garantielektronik.com/urunler", changeFrequency: "daily", priority: 0.9 },
    { url: "https://garantielektronik.com/parca-bulucu", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://garantielektronik.com/iletisim", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://garantielektronik.com/hakkimizda", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://garantielektronik.com/sss", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://garantielektronik.com/kargo-takip", changeFrequency: "monthly", priority: 0.5 },
    { url: "https://garantielektronik.com/garanti-iade", changeFrequency: "monthly", priority: 0.5 },
    { url: "https://garantielektronik.com/gizlilik-kvkk", changeFrequency: "yearly", priority: 0.3 },
    { url: "https://garantielektronik.com/cerez-politikasi", changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `https://garantielektronik.com/urun/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const brandPages: MetadataRoute.Sitemap = (brands ?? []).map((b) => ({
    url: `https://garantielektronik.com/marka/${b.slug}`,
    lastModified: b.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...brandPages];
}
