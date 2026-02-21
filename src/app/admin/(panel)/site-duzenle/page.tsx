import type { Metadata } from "next";
import AdminSiteEdit from "@/views/admin/AdminSiteEdit";

export const metadata: Metadata = {
  title: "Site Düzenle",
  robots: { index: false, follow: false },
};

export default function AdminSiteEditPage() {
  return <AdminSiteEdit />;
}
