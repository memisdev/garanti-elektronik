import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { normalizeProduct, type ProductRow } from "@/types/product";
import ProductPage from "@/views/ProductPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, brands(name, slug), categories(name, slug)")
    .eq("slug", slug)
    .maybeSingle();
  const product = data ? normalizeProduct(data as unknown as ProductRow) : undefined;
  return {
    title: product ? product.name : "Ürün",
    description: product ? `${product.name} - ${product.compatibility}` : "Ürün detayları",
  };
}

export default function ProductDetailPage() {
  return <ProductPage />;
}
