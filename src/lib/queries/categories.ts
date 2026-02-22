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

  // Fetch only category_id and first image per category using a minimal query
  const { data: products } = await supabase
    .from("products")
    .select("category_id, images")
    .not("category_id", "is", null);

  const countMap = new Map<string, number>();
  const imageMap = new Map<string, string>();

  if (products) {
    for (const p of products) {
      if (!p.category_id) continue;
      countMap.set(p.category_id, (countMap.get(p.category_id) ?? 0) + 1);
      if (!imageMap.has(p.category_id) && p.images?.[0]) {
        imageMap.set(p.category_id, p.images[0]);
      }
    }
  }

  return categories.map((cat) => ({
    ...cat,
    productCount: countMap.get(cat.id) ?? 0,
    firstImage: cat.image_url || imageMap.get(cat.id) || "/placeholder.svg",
  }));
}
