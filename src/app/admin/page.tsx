import type { Metadata } from "next";
import AdminLogin from "@/views/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Giriş",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
