import type { Metadata } from "next";
import AdminProducts from "@/views/admin/AdminProducts";

export const metadata: Metadata = {
  title: "Ürünler",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProducts />;
}
