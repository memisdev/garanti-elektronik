import type { Metadata } from "next";
import Contact from "@/views/Contact";
import { getContactMeta } from "@/lib/metadata";

const meta = getContactMeta();
export const metadata: Metadata = {
  title: "İletişim",
  description: meta.description,
};

export default function ContactPage() {
  return <Contact />;
}
