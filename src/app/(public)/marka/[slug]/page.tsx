import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getBrandMeta } from "@/lib/metadata";
import BrandPage from "@/views/BrandPage";

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("brands").select("slug");
  return (data ?? []).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("name, description")
    .eq("slug", slug)
    .maybeSingle();
  return getBrandMeta(slug, data?.name, data?.description);
}

export default function BrandDetailPage() {
  return <BrandPage />;
}
