import type { Metadata } from "next";
import WarrantyReturn from "@/views/WarrantyReturn";
import { getWarrantyMeta } from "@/lib/metadata";
import { fetchPageContentServer } from "@/lib/queries/pageContentServer";

export const revalidate = 86400;

export const metadata: Metadata = getWarrantyMeta();

export default async function WarrantyReturnPage() {
  const initialContent = await fetchPageContentServer("warranty");
  return <WarrantyReturn initialContent={initialContent} />;
}
