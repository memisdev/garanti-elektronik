import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getBrandMeta } from "@/lib/metadata";
import BrandPage from "@/views/BrandPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("name, description")
    .eq("slug", slug)
    .maybeSingle();
  return getBrandMeta(data?.name, data?.description);
}

export default function BrandDetailPage() {
  return <BrandPage />;
}
