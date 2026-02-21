import type { Metadata } from "next";
import type { Product } from "@/types/product";

export function getProductMeta(product?: Product): Metadata {
  return {
    title: product ? product.name : "Ürün",
    description: product ? `${product.name} - ${product.compatibility}` : "Ürün detayları",
    openGraph: product
      ? {
          title: product.name,
          description: `${product.name} - ${product.compatibility}`,
          images: product.images[0] ? [{ url: product.images[0] }] : [],
        }
      : undefined,
  };
}

export function getBrandMeta(
  brandName?: string,
  description?: string | null,
): Metadata {
  return {
    title: brandName ? `${brandName} Ürünleri` : "Marka",
    description: description ?? "Marka ürünleri",
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
  };
}

export function getProductsMeta(): Metadata {
  return {
    title: "Ürünler",
    description:
      "TV yedek parça, anakart, power board, T-Con board ve daha fazlası. Tüm markalarda orijinal ve muadil parçalar.",
  };
}

export function getAboutMeta(): Metadata {
  return {
    title: "Hakkımızda",
    description:
      "2010'dan beri TV yedek parça tedarikinde güvenilir isim. Samsung, LG, Vestel ve daha fazlası.",
  };
}

export function getContactMeta(): Metadata {
  return {
    title: "İletişim",
    description:
      "Garanti Elektronik ile iletişime geçin. Adres, telefon, e-posta ve WhatsApp bilgileri.",
  };
}

export function getFAQMeta(): Metadata {
  return {
    title: "Sıkça Sorulan Sorular",
    description:
      "TV yedek parça siparişi, kargo, iade ve garanti hakkında sıkça sorulan sorular ve yanıtları.",
  };
}

export function getCargoTrackingMeta(): Metadata {
  return {
    title: "Kargo Takip",
    description:
      "Siparişinizin kargo durumunu takip edin. Yurtiçi, Aras, MNG, PTT ve Sürat kargo sorgulaması.",
  };
}

export function getWarrantyMeta(): Metadata {
  return {
    title: "Garanti ve İade Koşulları",
    description:
      "Orijinal parçalarda 6 ay, muadil parçalarda 3 ay garanti. 14 gün içinde iade imkânı.",
  };
}

export function getPrivacyMeta(): Metadata {
  return {
    title: "Gizlilik ve KVKK Politikası",
    description:
      "Kişisel verilerin korunması ve KVKK kapsamındaki haklarınız hakkında bilgilendirme.",
  };
}

export function getCookieMeta(): Metadata {
  return {
    title: "Çerez Politikası",
    description:
      "Web sitemizde kullanılan çerezler ve yönetim seçenekleri hakkında bilgi.",
  };
}

export function getPartFinderMeta(): Metadata {
  return {
    title: "TV Parça Bulucu",
    description:
      "TV model numaranızı girin veya Garanti Asistan'a arızanızı anlatın, uyumlu yedek parçaları anında bulun.",
  };
}
