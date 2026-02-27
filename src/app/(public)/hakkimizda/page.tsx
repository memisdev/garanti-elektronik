import type { Metadata } from "next";
import About from "@/views/About";
import { getAboutMeta } from "@/lib/metadata";
import { fetchPageContentServer } from "@/lib/queries/pageContentServer";

export const revalidate = 86400;

export const metadata: Metadata = getAboutMeta();

export default async function AboutPage() {
  const initialContent = await fetchPageContentServer("about");
  return <About initialContent={initialContent} />;
}
