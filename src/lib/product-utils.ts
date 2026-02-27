import type { Product } from "@/types/product";

// --- Status helpers ---

export const PRODUCT_STATUS_OPTIONS = [
  { value: "tested", label: "Test Edilmiş - Çalışır Durumda" },
  { value: "refurbished", label: "Yenilenmiş" },
  { value: "new", label: "Sıfır Ürün" },
  { value: "as-is", label: "Arızalı / Parça İçin" },
  { value: "out-of-stock", label: "Stokta Yok" },
] as const;

export const DEFAULT_STATUS = "tested";

export function getItemCondition(status: string | null): string {
  switch (status) {
    case "new":
      return "https://schema.org/NewCondition";
    case "refurbished":
    case "tested":
      return "https://schema.org/RefurbishedCondition";
    case "as-is":
      return "https://schema.org/DamagedCondition";
    default:
      return "https://schema.org/RefurbishedCondition";
  }
}

export function getItemAvailability(status: string | null): string {
  if (status === "out-of-stock") return "https://schema.org/OutOfStock";
  return "https://schema.org/InStock";
}

export function getStatusBadgeStyle(status: string | null): {
  text: string;
  dotClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
} {
  const resolved = status ?? DEFAULT_STATUS;
  switch (resolved) {
    case "new":
      return { text: "Sıfır Ürün", dotClass: "bg-blue-500", textClass: "text-blue-700", bgClass: "bg-blue-50", borderClass: "border-blue-200" };
    case "refurbished":
      return { text: "Yenilenmiş", dotClass: "bg-emerald-500", textClass: "text-emerald-700", bgClass: "bg-emerald-50", borderClass: "border-emerald-200" };
    case "tested":
      return { text: "Test Edilmiş - Çalışır Durumda", dotClass: "bg-green-500", textClass: "text-green-700", bgClass: "bg-green-50", borderClass: "border-green-200" };
    case "as-is":
      return { text: "Arızalı / Parça İçin", dotClass: "bg-orange-500", textClass: "text-orange-700", bgClass: "bg-orange-50", borderClass: "border-orange-200" };
    case "out-of-stock":
      return { text: "Stokta Yok", dotClass: "bg-red-500", textClass: "text-red-700", bgClass: "bg-red-50", borderClass: "border-red-200" };
    default:
      return { text: "Test Edilmiş - Çalışır Durumda", dotClass: "bg-green-500", textClass: "text-green-700", bgClass: "bg-green-50", borderClass: "border-green-200" };
  }
}

// --- Content generators ---

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
    "Garanti Elektronik güvencesiyle orijinal ve kaliteli yedek parça tedariği."
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
