import type { Metadata } from "next";
import Index from "@/views/Index";
import { WebSiteJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "TV Yedek Parça ve Anakart | Garanti Elektronik",
  },
  description:
    "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariği. 500+ ürün, aynı gün kargo, teknik destek.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <WebSiteJsonLd />
      <Index />
    </>
  );
}
