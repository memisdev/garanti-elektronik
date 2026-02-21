import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at");

  const { data: brands } = await supabase
    .from("brands")
    .select("slug, updated_at");

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://garantielektronik.net", changeFrequency: "weekly", priority: 1.0 },
    { url: "https://garantielektronik.net/urunler", changeFrequency: "daily", priority: 0.9 },
    { url: "https://garantielektronik.net/parca-bulucu", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://garantielektronik.net/iletisim", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://garantielektronik.net/hakkimizda", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://garantielektronik.net/sss", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://garantielektronik.net/kargo-takip", changeFrequency: "monthly", priority: 0.5 },
    { url: "https://garantielektronik.net/garanti-iade", changeFrequency: "monthly", priority: 0.5 },
    { url: "https://garantielektronik.net/gizlilik-kvkk", changeFrequency: "yearly", priority: 0.3 },
    { url: "https://garantielektronik.net/cerez-politikasi", changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `https://garantielektronik.net/urun/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const brandPages: MetadataRoute.Sitemap = (brands ?? []).map((b) => ({
    url: `https://garantielektronik.net/marka/${b.slug}`,
    lastModified: b.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...brandPages];
}
