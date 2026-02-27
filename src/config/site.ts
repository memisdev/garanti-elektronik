export const MAX_FEATURED_PRODUCTS = 4;

export const siteConfig = {
  name: "Garanti Elektronik",
  shortName: "GE",
  description:
    "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariği. Profesyonel teknik servisler için güvenilir çözüm ortağı.",
  url: "https://garantielektronik.net",
  whatsapp: {
    number: "905465125035",
    defaultMessage: (productName: string, code?: string) =>
      `Merhaba, ${productName}${code ? ` (${code})` : ""} hakkında bilgi almak istiyorum.`,
  },
  contact: {
    phone: "0546 512 50 35",
    phoneHref: "tel:+905465125035",
    email: "info@garantielektronik.net",
    address: "Mehmet Akif, Kılıç Ali Sk. No:32, 34000 Küçükçekmece/İstanbul",
    mapsUrl: "https://maps.google.com/?q=Mehmet+Akif+Mah+K%C4%B1l%C4%B1%C3%A7+Ali+Sk+No:32+K%C3%BC%C3%A7%C3%BCk%C3%A7ekmece+%C4%B0stanbul",
    workingHours: "Pzt–Cmt: 09:00 – 18:00",
  },
  social: {
    whatsappUrl: (message: string) =>
      `https://wa.me/905465125035?text=${encodeURIComponent(message)}`,
  },
} as const;
