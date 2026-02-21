import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BrandPage from "@/views/BrandPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("name, description")
    .eq("slug", slug)
    .maybeSingle();
  return {
    title: data ? `${data.name} Ürünleri` : "Marka",
    description: data?.description ?? "Marka ürünleri",
  };
}

export default function BrandDetailPage() {
  return <BrandPage />;
}
