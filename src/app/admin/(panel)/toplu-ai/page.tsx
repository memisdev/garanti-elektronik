import type { Metadata } from "next";
import AdminBatchAI from "@/views/admin/AdminBatchAI";

export const metadata: Metadata = {
  title: "Toplu AI İşlemleri",
  robots: { index: false, follow: false },
};

export default function AdminBatchAIPage() {
  return <AdminBatchAI />;
}
