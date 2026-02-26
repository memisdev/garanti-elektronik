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
  return {
    title: brandName ? `${brandName} Ürünleri` : "Marka",
    description: description ?? "Marka ürünleri",
    alternates: {
      canonical: brandSlug ? `/marka/${brandSlug}` : undefined,
    },
    openGraph: brandName
      ? {
          title: `${brandName} Ürünleri`,
          description: description ?? "Marka ürünleri",
        }
      : undefined,
  };
}

export function getIndexMeta(): Metadata {
  return {
    title: "Garanti Elektronik | Orijinal TV Yedek Parça ve Anakart Tedarikçisi",
    description:
      "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariki. 500+ ürün, aynı gün kargo, teknik destek.",
    alternates: { canonical: "/" },
  };
}

export function getProductsMeta(): Metadata {
  return {
    title: "Ürünler",
    description:
      "TV yedek parça, anakart, power board, T-Con board ve daha fazlası. Tüm markalarda orijinal ve muadil parçalar.",
    alternates: { canonical: "/urunler" },
  };
}

export function getAboutMeta(): Metadata {
  return {
    title: "Hakkımızda",
    description:
      "2010'dan beri TV yedek parça tedarikinde güvenilir isim. Samsung, LG, Vestel ve daha fazlası.",
    alternates: { canonical: "/hakkimizda" },
  };
}

export function getContactMeta(): Metadata {
  return {
    title: "İletişim",
    description:
      "Garanti Elektronik ile iletişime geçin. Adres, telefon, e-posta ve WhatsApp bilgileri.",
    alternates: { canonical: "/iletisim" },
  };
}

export function getFAQMeta(): Metadata {
  return {
    title: "Sıkça Sorulan Sorular",
    description:
      "TV yedek parça siparişi, kargo, iade ve garanti hakkında sıkça sorulan sorular ve yanıtları.",
    alternates: { canonical: "/sss" },
  };
}

export function getCargoTrackingMeta(): Metadata {
  return {
    title: "Kargo Takip",
    description:
      "Siparişinizin kargo durumunu takip edin. Yurtiçi, Aras, MNG, PTT ve Sürat kargo sorgulaması.",
    alternates: { canonical: "/kargo-takip" },
  };
}

export function getWarrantyMeta(): Metadata {
  return {
    title: "Garanti ve İade Koşulları",
    description:
      "Orijinal parçalarda 6 ay, muadil parçalarda 3 ay garanti. 14 gün içinde iade imkânı.",
    alternates: { canonical: "/garanti-iade" },
  };
}

export function getPrivacyMeta(): Metadata {
  return {
    title: "Gizlilik ve KVKK Politikası",
    description:
      "Kişisel verilerin korunması ve KVKK kapsamındaki haklarınız hakkında bilgilendirme.",
    alternates: { canonical: "/gizlilik-kvkk" },
  };
}

export function getCookieMeta(): Metadata {
  return {
    title: "Çerez Politikası",
    description:
      "Web sitemizde kullanılan çerezler ve yönetim seçenekleri hakkında bilgi.",
    alternates: { canonical: "/cerez-politikasi" },
  };
}

export function getPartFinderMeta(): Metadata {
  return {
    title: "TV Parça Bulucu",
    description:
      "TV model numaranızı girin veya Garanti Asistan'a arızanızı anlatın, uyumlu yedek parçaları anında bulun.",
    alternates: { canonical: "/parca-bulucu" },
  };
}
