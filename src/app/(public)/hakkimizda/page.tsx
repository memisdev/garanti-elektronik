import type { Metadata } from "next";
import About from "@/views/About";
import { getAboutMeta } from "@/lib/metadata";

const meta = getAboutMeta();
export const metadata: Metadata = {
  title: "Hakkımızda",
  description: meta.description,
};

export default function AboutPage() {
  return <About />;
}
