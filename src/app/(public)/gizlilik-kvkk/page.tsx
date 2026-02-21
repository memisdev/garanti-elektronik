import type { Metadata } from "next";
import PrivacyKVKK from "@/views/PrivacyKVKK";
import { getPrivacyMeta } from "@/lib/metadata";

const meta = getPrivacyMeta();
export const metadata: Metadata = {
  title: "Gizlilik ve KVKK Politikası",
  description: meta.description,
};

export default function PrivacyKVKKPage() {
  return <PrivacyKVKK />;
}
