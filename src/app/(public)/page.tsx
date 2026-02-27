import type { Metadata } from "next";
import Index, { type IndexPageContent } from "@/views/Index";
import { WebSiteJsonLd } from "@/components/seo/JsonLd";
import { fetchPageContentServer } from "@/lib/queries/pageContentServer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "TV Yedek Parça ve Anakart | Garanti Elektronik",
  },
  description:
    "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariği. 500+ ürün, aynı gün kargo, teknik destek.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [home_hero, home_cta, home_stats, home_features] = await Promise.all([
    fetchPageContentServer("home_hero"),
    fetchPageContentServer("home_cta"),
    fetchPageContentServer("home_stats"),
    fetchPageContentServer("home_features"),
  ]);

  const initialPageContent: IndexPageContent = {
    home_hero,
    home_cta,
    home_stats,
    home_features,
  };

  return (
    <>
      <WebSiteJsonLd />
      <Index initialPageContent={initialPageContent} />
    </>
  );
}
