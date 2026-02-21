import { supabase } from "@/integrations/supabase/client";
import { normalizeProduct, type Product, type ProductRow } from "@/types/product";
import { escapeIlike } from "@/lib/escapeIlike";

const PRODUCT_SELECT = "*, brands(name, slug), categories(name, slug)" as const;

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_featured", true)
    .order("featured_order")
    .limit(4);
  if (error) throw error;
  return (data as unknown as ProductRow[] | null)?.map(normalizeProduct) ?? [];
}

export async function fetchRecentProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) throw error;
  return (data as unknown as ProductRow[] | null)?.map(normalizeProduct) ?? [];
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? normalizeProduct(data as unknown as ProductRow) : undefined;
}

export interface FetchProductsOptions {
  query?: string;
  category?: string;
  brand?: string;
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<{ products: Product[]; total: number }> {
  const { query, category, brand } = options;

  let q = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" });

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .maybeSingle();
    if (cat) q = q.eq("category_id", cat.id);
  }

  if (brand) {
    const { data: br } = await supabase
      .from("brands")
      .select("id")
      .ilike("name", brand)
      .maybeSingle();
    if (br) q = q.eq("brand_id", br.id);
  }

  if (query) {
    const escaped = escapeIlike(query);
    q = q.or(`name.ilike.%${escaped}%,code.ilike.%${escaped}%`);
  }

  const { data, count, error } = await q.order("created_at", { ascending: false });
  if (error) throw error;
  return {
    products: (data as unknown as ProductRow[] | null)?.map(normalizeProduct) ?? [],
    total: count ?? 0,
  };
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (query.length < 2) return [];
  const escaped = escapeIlike(query);
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .or(`name.ilike.%${escaped}%,code.ilike.%${escaped}%`)
    .limit(8);
  if (error) throw error;
  return (data as unknown as ProductRow[] | null)?.map(normalizeProduct) ?? [];
}
