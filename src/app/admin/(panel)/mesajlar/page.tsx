import type { Metadata } from "next";
import AdminMessages from "@/views/admin/AdminMessages";

export const metadata: Metadata = {
  title: "Mesajlar",
  robots: { index: false, follow: false },
};

export default function AdminMessagesPage() {
  return <AdminMessages />;
}
