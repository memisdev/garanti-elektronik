import { createClient } from "@/lib/supabase/server";
import { normalizeProduct, type Product, type ProductQueryRow } from "@/types/product";
import { escapeIlike } from "@/lib/escapeIlike";

const PRODUCT_SELECT = "*, brands(name, slug), categories(name, slug)" as const;

export interface FetchProductsServerOptions {
    query?: string;
    category?: string;
    brand?: string;
    page?: number;
    pageSize?: number;
}

/**
 * Server-side product fetching using the cookie-based Supabase server client.
 * Same logic as fetchProducts() but safe for use in Server Components / Route Handlers.
 */
export async function fetchProductsServer(
    options: FetchProductsServerOptions = {},
): Promise<{ products: Product[]; total: number }> {
    const { query, category, brand, page = 0, pageSize = 24 } = options;

    const supabase = await createClient();

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

/**
 * Fetch all products for a given brand ID (server-side).
 * Used by `/marka/[slug]` server component.
 */
export async function fetchProductsByBrandServer(brandId: string): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("brand_id", brandId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ProductQueryRow[] | null)?.map(normalizeProduct) ?? [];
}

/**
 * Fetch all products for a given category ID (server-side).
 * Used by `/kategori/[slug]` server component.
 */
export async function fetchProductsByCategoryServer(categoryId: string): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ProductQueryRow[] | null)?.map(normalizeProduct) ?? [];
}
