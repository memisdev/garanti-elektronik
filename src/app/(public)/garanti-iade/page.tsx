import type { Metadata } from "next";
import WarrantyReturn from "@/views/WarrantyReturn";
import { getWarrantyMeta } from "@/lib/metadata";

export const revalidate = 86400;

const meta = getWarrantyMeta();
export const metadata: Metadata = {
  title: "Garanti ve İade Koşulları",
  description: meta.description,
};

export default function WarrantyReturnPage() {
  return <WarrantyReturn />;
}
