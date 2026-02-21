import type { Metadata } from "next";
import NotFound from "@/views/NotFound";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
};

export default function NotFoundPage() {
  return <NotFound />;
}
