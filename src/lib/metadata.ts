import type { Metadata } from "next";
import type { Product } from "@/types/product";
import { generateProductDescription } from "@/lib/product-utils";

export function getProductMeta(product?: Product): Metadata {
  if (!product) {
    return {
      title: "Ürün",
      description: "Ürün detayları",
    };
  }

  const description = product.description || generateProductDescription(product);
  const title = product.code
    ? `${product.name} (${product.code})`
    : product.name;

  return {
    title,
    description,
    alternates: {
      canonical: `/urun/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      images: product.images[0]
        ? [{ url: product.images[0], width: 800, height: 600 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export function getBrandMeta(
  brandSlug?: string,
  brandName?: string,
  description?: string | null,
): Metadata {
  const title = brandName
    ? `${brandName} TV Yedek Parça ve Anakart | Garanti Elektronik`
    : "Marka";
  const desc = description
    ?? (brandName
      ? `${brandName} televizyon yedek parça. ${brandName} anakart, mainboard, power board, led bar. Orijinal ve test edilmiş.`
      : "Marka ürünleri");

  return {
    title,
    description: desc,
    alternates: {
      canonical: brandSlug ? `/marka/${brandSlug}` : undefined,
    },
    openGraph: brandName
      ? { title, description: desc }
      : undefined,
    twitter: brandName
      ? { card: "summary_large_image", title, description: desc }
      : undefined,
  };
}

export function getIndexMeta(): Metadata {
  return {
    title: "TV Yedek Parça ve Anakart | Garanti Elektronik",
    description:
      "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariki. 500+ ürün, aynı gün kargo, teknik destek.",
    alternates: { canonical: "/" },
  };
}

export function getProductsMeta(): Metadata {
  const title = "TV Yedek Parça Ürünleri | Garanti Elektronik";
  const description =
    "Samsung, LG, Vestel, Arçelik ve 45+ marka için TV yedek parça. Anakart, power board, T-Con board, LED bar, kumanda ve daha fazlası. Orijinal ve muadil parçalar.";
  return {
    title,
    description,
    alternates: { canonical: "/urunler" },
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function getAboutMeta(): Metadata {
  const title = "Hakkımızda";
  const description =
    "2010'dan beri TV yedek parça tedarikinde güvenilir isim. Samsung, LG, Vestel ve daha fazlası.";
  return {
    title,
    description,
    alternates: { canonical: "/hakkimizda" },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export function getContactMeta(): Metadata {
  const title = "İletişim - TV Yedek Parça Siparişi | Garanti Elektronik";
  const description =
    "TV yedek parça siparişi ve teknik destek için Garanti Elektronik ile iletişime geçin. Adres, telefon, e-posta ve WhatsApp bilgileri.";
  return {
    title,
    description,
    alternates: { canonical: "/iletisim" },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export function getFAQMeta(): Metadata {
  const title = "Sıkça Sorulan Sorular - TV Yedek Parça | Garanti Elektronik";
  const description =
    "TV yedek parça siparişi, kargo, iade ve garanti hakkında sıkça sorulan sorular ve yanıtları.";
  return {
    title,
    description,
    alternates: { canonical: "/sss" },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export function getCargoTrackingMeta(): Metadata {
  const title = "Kargo Takip";
  const description =
    "Siparişinizin kargo durumunu takip edin. Yurtiçi, Aras, MNG, PTT ve Sürat kargo sorgulaması.";
  return {
    title,
    description,
    alternates: { canonical: "/kargo-takip" },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export function getWarrantyMeta(): Metadata {
  const title = "Garanti ve İade Koşulları";
  const description =
    "Orijinal parçalarda 6 ay, muadil parçalarda 3 ay garanti. 14 gün içinde iade imkânı.";
  return {
    title,
    description,
    alternates: { canonical: "/garanti-iade" },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export function getPrivacyMeta(): Metadata {
  const title = "Gizlilik ve KVKK Politikası";
  const description =
    "Kişisel verilerin korunması ve KVKK kapsamındaki haklarınız hakkında bilgilendirme.";
  return {
    title,
    description,
    alternates: { canonical: "/gizlilik-kvkk" },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export function getCookieMeta(): Metadata {
  const title = "Çerez Politikası";
  const description =
    "Web sitemizde kullanılan çerezler ve yönetim seçenekleri hakkında bilgi.";
  return {
    title,
    description,
    alternates: { canonical: "/cerez-politikasi" },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export function getPartFinderMeta(): Metadata {
  const title = "TV Parça Bulucu - Uyumlu Yedek Parça Bul | Garanti Elektronik";
  const description =
    "TV model numaranızı girin veya Garanti Asistan'a arızanızı anlatın, uyumlu yedek parçaları anında bulun.";
  return {
    title,
    description,
    alternates: { canonical: "/parca-bulucu" },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}
