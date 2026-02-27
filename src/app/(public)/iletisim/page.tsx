import type { Metadata } from "next";
import Contact from "@/views/Contact";
import { getContactMeta } from "@/lib/metadata";
import { fetchPageContentServer } from "@/lib/queries/pageContentServer";

export const revalidate = 86400;

export const metadata: Metadata = getContactMeta();

export default async function ContactPage() {
  const initialContent = await fetchPageContentServer("contact");
  return <Contact initialContent={initialContent} />;
}
