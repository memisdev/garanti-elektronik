import type { Product } from "@/types/product";

export interface PageMeta {
  title: string;
  description: string;
}

export function getIndexMeta(): PageMeta {
  return {
    title: "Garanti Elektronik | Orijinal TV Yedek Parça ve Anakart Tedarikçisi",
    description: "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariki. 500+ ürün, aynı gün kargo, teknik destek.",
  };
}

export function getProductsMeta(): PageMeta {
  return {
    title: "Ürünler | Garanti Elektronik",
    description: "TV yedek parça, anakart, power board, T-Con board ve daha fazlası. Tüm markalarda orijinal ve muadil parçalar.",
  };
}

export function getProductMeta(product?: Product): PageMeta {
  return {
    title: product ? `${product.name} | Garanti Elektronik` : "Ürün | Garanti Elektronik",
    description: product ? `${product.name} - ${product.compatibility}` : "Ürün detayları",
  };
}

export function getBrandMeta(brandName?: string, description?: string | null): PageMeta {
  return {
    title: brandName ? `${brandName} Ürünleri | Garanti Elektronik` : "Marka | Garanti Elektronik",
    description: description ?? "Marka ürünleri",
  };
}

export function getAboutMeta(): PageMeta {
  return {
    title: "Hakkımızda | Garanti Elektronik",
    description: "2010'dan beri TV yedek parça tedarikinde güvenilir isim. Samsung, LG, Vestel ve daha fazlası.",
  };
}

export function getContactMeta(): PageMeta {
  return {
    title: "İletişim | Garanti Elektronik",
    description: "Garanti Elektronik ile iletişime geçin. Adres, telefon, e-posta ve WhatsApp bilgileri.",
  };
}

export function getFAQMeta(): PageMeta {
  return {
    title: "Sıkça Sorulan Sorular | Garanti Elektronik",
    description: "TV yedek parça siparişi, kargo, iade ve garanti hakkında sıkça sorulan sorular ve yanıtları.",
  };
}

export function getCargoTrackingMeta(): PageMeta {
  return {
    title: "Kargo Takip | Garanti Elektronik",
    description: "Siparişinizin kargo durumunu takip edin. Yurtiçi, Aras, MNG, PTT ve Sürat kargo sorgulaması.",
  };
}

export function getWarrantyMeta(): PageMeta {
  return {
    title: "Garanti ve İade Koşulları | Garanti Elektronik",
    description: "Orijinal parçalarda 6 ay, muadil parçalarda 3 ay garanti. 14 gün içinde iade imkânı.",
  };
}

export function getPrivacyMeta(): PageMeta {
  return {
    title: "Gizlilik ve KVKK Politikası | Garanti Elektronik",
    description: "Kişisel verilerin korunması ve KVKK kapsamındaki haklarınız hakkında bilgilendirme.",
  };
}

export function getCookieMeta(): PageMeta {
  return {
    title: "Çerez Politikası | Garanti Elektronik",
    description: "Web sitemizde kullanılan çerezler ve yönetim seçenekleri hakkında bilgi.",
  };
}

export function getPartFinderMeta(): PageMeta {
  return {
    title: "TV Parça Bulucu | Garanti Elektronik",
    description: "TV model numaranızı girin veya Garanti Asistan'a arızanızı anlatın, uyumlu yedek parçaları anında bulun.",
  };
}
