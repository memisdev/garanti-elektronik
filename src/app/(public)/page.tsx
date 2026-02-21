import type { Metadata } from "next";
import Index from "@/views/Index";

export const metadata: Metadata = {
  title: {
    absolute: "Garanti Elektronik | Orijinal TV Yedek Parça ve Anakart Tedarikçisi",
  },
  description:
    "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariki. 500+ ürün, aynı gün kargo, teknik destek.",
};

export default function HomePage() {
  return <Index />;
}
