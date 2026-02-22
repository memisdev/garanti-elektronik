import { supabase } from "@/integrations/supabase/client";
import { normalizeProduct, type Product, type ProductQueryRow } from "@/types/product";
import { escapeIlike } from "@/lib/escapeIlike";
import { MAX_FEATURED_PRODUCTS } from "@/config/site";

const PRODUCT_SELECT = "*, brands(name, slug), categories(name, slug)" as const;

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_featured", true)
    .order("featured_order")
    .limit(MAX_FEATURED_PRODUCTS);
  if (error) throw error;
  return (data as ProductQueryRow[] | null)?.map(normalizeProduct) ?? [];
}

export async function fetchRecentProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) throw error;
  return (data as ProductQueryRow[] | null)?.map(normalizeProduct) ?? [];
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? normalizeProduct(data as ProductQueryRow) : undefined;
}

export interface FetchProductsOptions {
  query?: string;
  category?: string;
  brand?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<{ products: Product[]; total: number }> {
  const { query, category, brand, page = 0, pageSize = 24 } = options;

  let q = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" });

  // Resolve category and brand IDs in parallel
  const [catId, brandId] = await Promise.all([
    category
      ? supabase
          .from("categories")
          .select("id")
          .eq("slug", category)
          .maybeSingle()
          .then(({ data }) => data?.id)
      : Promise.resolve(undefined),
    brand
      ? supabase
          .from("brands")
          .select("id")
          .ilike("name", brand)
          .maybeSingle()
          .then(({ data }) => data?.id)
      : Promise.resolve(undefined),
  ]);

  if (catId) q = q.eq("category_id", catId);
  if (brandId) q = q.eq("brand_id", brandId);

  if (query) {
    const escaped = escapeIlike(query);
    q = q.or(`name.ilike.%${escaped}%,code.ilike.%${escaped}%`);
  }

  const from = page * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await q.order("created_at", { ascending: false }).range(from, to);
  if (error) throw error;
  return {
    products: (data as ProductQueryRow[] | null)?.map(normalizeProduct) ?? [],
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
  return (data as ProductQueryRow[] | null)?.map(normalizeProduct) ?? [];
}
