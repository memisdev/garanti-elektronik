import type { Metadata } from "next";
import AdminBrands from "@/views/admin/AdminBrands";

export const metadata: Metadata = {
  title: "Markalar",
  robots: { index: false, follow: false },
};

export default function AdminBrandsPage() {
  return <AdminBrands />;
}
