import type { Metadata } from "next";
import AdminUsers from "@/views/admin/AdminUsers";

export const metadata: Metadata = {
  title: "Kullanıcılar",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}
