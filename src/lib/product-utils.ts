import type { Product } from "@/types/product";

export function generateProductDescription(product: Product): string {
  const parts: string[] = [];

  parts.push(
    `${product.name}, ${product.brand} marka${product.categories?.name ? ` ${product.categories.name} kategorisinde` : ""} orijinal yedek parçadır.`
  );

  if (product.code) {
    parts.push(`Parça kodu: ${product.code}.`);
  }

  if (product.compatibility) {
    parts.push(`Uyumlu modeller: ${product.compatibility}.`);
  }

  parts.push("Test edilmiş, çalışır durumda gönderilmektedir.");
  parts.push(
    "Garanti Elektronik güvencesiyle orijinal ve kaliteli yedek parça tedariki."
  );

  return parts.join(" ");
}

export interface FAQItem {
  q: string;
  a: string;
}

export function generateProductFAQs(product: Product): FAQItem[] {
  const faqs: FAQItem[] = [
    {
      q: `${product.name} orijinal mi?`,
      a: `Evet, ${product.name} orijinal ${product.brand} yedek parçadır. Tüm ürünlerimiz test edilmiş ve çalışır durumda gönderilmektedir.`,
    },
    {
      q: `${product.name} hangi modellere uyumludur?`,
      a: product.compatibility
        ? `${product.name} şu modellerle uyumludur: ${product.compatibility}.`
        : `Uyumluluk bilgisi için lütfen WhatsApp üzerinden bize ulaşın.`,
    },
    {
      q: `${product.name} garanti kapsamında mı?`,
      a: `Evet, tüm ürünlerimiz Garanti Elektronik güvencesiyle satılmaktadır. Orijinal parçalarda 6 ay, muadil parçalarda 3 ay garanti sunuyoruz.`,
    },
    {
      q: `${product.name} nasıl sipariş verebilirim?`,
      a: `WhatsApp üzerinden veya iletişim sayfamızdan bize ulaşarak sipariş verebilirsiniz. Aynı gün kargo imkânı sunuyoruz.`,
    },
    {
      q: `${product.name} kargo süresi ne kadar?`,
      a: `Siparişiniz aynı gün kargoya verilir. Kargo süresi bulunduğunuz il ve kargo firmasına göre 1-3 iş günüdür.`,
    },
  ];

  return faqs;
}

export function parseCompatibilityModels(
  compatibility: string | null
): string[] {
  if (!compatibility) return [];
  return compatibility
    .split(/[,;]/)
    .map((m) => m.trim())
    .filter(Boolean);
}
