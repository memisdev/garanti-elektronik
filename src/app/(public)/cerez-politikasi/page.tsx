import type { Metadata } from "next";
import CookiePolicy from "@/views/CookiePolicy";
import { getCookieMeta } from "@/lib/metadata";
import { fetchPageContentServer } from "@/lib/queries/pageContentServer";

export const revalidate = 86400;

export const metadata: Metadata = getCookieMeta();

export default async function CookiePolicyPage() {
  const initialContent = await fetchPageContentServer("cookie");
  return <CookiePolicy initialContent={initialContent} />;
}
