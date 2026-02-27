import type { Metadata } from "next";
import FAQ from "@/views/FAQ";
import { getFAQMeta } from "@/lib/metadata";
import { fetchPageContentServer } from "@/lib/queries/pageContentServer";

export const revalidate = 86400;

export const metadata: Metadata = getFAQMeta();

export default async function FAQPage() {
  const initialContent = await fetchPageContentServer("faq");
  return <FAQ initialContent={initialContent} />;
}
