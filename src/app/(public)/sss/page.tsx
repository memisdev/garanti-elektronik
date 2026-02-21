import type { Metadata } from "next";
import FAQ from "@/views/FAQ";
import { getFAQMeta } from "@/lib/metadata";

const meta = getFAQMeta();
export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: meta.description,
};

export default function FAQPage() {
  return <FAQ />;
}
