import type { Metadata } from "next";
import Index from "@/views/Index";
import { getIndexMeta } from "@/lib/metadata";

const meta = getIndexMeta();
export const metadata: Metadata = {
  title: { absolute: meta.title },
  description: meta.description,
};

export default function HomePage() {
  return <Index />;
}
