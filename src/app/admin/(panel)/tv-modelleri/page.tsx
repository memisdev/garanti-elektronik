import type { Metadata } from "next";
import AdminTVModels from "@/views/admin/AdminTVModels";

export const metadata: Metadata = {
  title: "TV Modelleri",
  robots: { index: false, follow: false },
};

export default function AdminTVModelsPage() {
  return <AdminTVModels />;
}
