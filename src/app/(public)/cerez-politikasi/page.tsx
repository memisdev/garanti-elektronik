import type { Metadata } from "next";
import CookiePolicy from "@/views/CookiePolicy";
import { getCookieMeta } from "@/lib/metadata";

const meta = getCookieMeta();
export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: meta.description,
};

export default function CookiePolicyPage() {
  return <CookiePolicy />;
}
