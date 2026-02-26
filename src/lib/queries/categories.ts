import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  productCount?: number;
  firstImage?: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  if (!categories || categories.length === 0) return [];

  // Single query via the category_stats view (replaces N+1 pattern)
  const { data: stats } = await supabase
    .from("category_stats")
    .select("category_id, product_count, first_product_image");

  const statsMap = new Map(
    (stats ?? []).map(
      (s) => [s.category_id, s] as const
    )
  );

  return categories.map((cat) => {
    const s = statsMap.get(cat.id);
    return {
      ...cat,
      productCount: s?.product_count ?? 0,
      firstImage: cat.image_url || s?.first_product_image || "/placeholder.svg",
    };
  });
}
