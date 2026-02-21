import type { Metadata } from "next";
import AdminPageContents from "@/views/admin/AdminPageContents";

export const metadata: Metadata = {
  title: "Sayfa İçerikleri",
  robots: { index: false, follow: false },
};

export default function AdminPageContentsPage() {
  return <AdminPageContents />;
}
