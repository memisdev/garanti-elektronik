import type { Metadata } from "next";
import AdminAuditLog from "@/views/admin/AdminAuditLog";

export const metadata: Metadata = {
  title: "İşlem Kaydı",
  robots: { index: false, follow: false },
};

export default function AdminAuditLogPage() {
  return <AdminAuditLog />;
}
