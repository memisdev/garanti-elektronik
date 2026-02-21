import type { Metadata } from "next";
import PrivacyKVKK from "@/views/PrivacyKVKK";
import { getPrivacyMeta } from "@/lib/metadata";

export const revalidate = 86400;

const meta = getPrivacyMeta();
export const metadata: Metadata = {
  title: "Gizlilik ve KVKK Politikası",
  description: meta.description,
};

export default function PrivacyKVKKPage() {
  return <PrivacyKVKK />;
}
