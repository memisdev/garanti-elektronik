import type { Metadata } from "next";
import PrivacyKVKK from "@/views/PrivacyKVKK";
import { getPrivacyMeta } from "@/lib/metadata";
import { fetchPageContentServer } from "@/lib/queries/pageContentServer";

export const revalidate = 86400;

export const metadata: Metadata = getPrivacyMeta();

export default async function PrivacyKVKKPage() {
  const initialContent = await fetchPageContentServer("privacy");
  return <PrivacyKVKK initialContent={initialContent} />;
}
