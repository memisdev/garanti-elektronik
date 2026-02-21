import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { normalizeProduct, type ProductRow } from "@/types/product";
import { getProductMeta } from "@/lib/metadata";
import ProductPage from "@/views/ProductPage";

export const revalidate = 1800;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("products").select("slug");
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, brands(name, slug), categories(name, slug)")
    .eq("slug", slug)
    .maybeSingle();
  const product = data ? normalizeProduct(data as unknown as ProductRow) : undefined;
  return getProductMeta(product);
}

export default function ProductDetailPage() {
  return <ProductPage />;
}
