import type { Metadata } from "next";
import AdminSEO from "@/views/admin/AdminSEO";

export const metadata: Metadata = {
  title: "SEO",
  robots: { index: false, follow: false },
};

export default function AdminSEOPage() {
  return <AdminSEO />;
}
