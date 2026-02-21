import type { Metadata } from "next";
import AdminCategories from "@/views/admin/AdminCategories";

export const metadata: Metadata = {
  title: "Kategoriler",
  robots: { index: false, follow: false },
};

export default function AdminCategoriesPage() {
  return <AdminCategories />;
}
