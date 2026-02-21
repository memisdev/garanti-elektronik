import type { Metadata } from "next";
import AdminMedia from "@/views/admin/AdminMedia";

export const metadata: Metadata = {
  title: "Medya",
  robots: { index: false, follow: false },
};

export default function AdminMediaPage() {
  return <AdminMedia />;
}
