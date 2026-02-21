import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  productCount?: number;
  firstImage?: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      // Fetch categories and product data in parallel (2 queries instead of N+1)
      const [catRes, prodRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("products").select("category_id, images"),
      ]);

      if (!catRes.data) { setLoading(false); return; }

      const products = prodRes.data ?? [];

      // Build count and firstImage maps in one pass
      const countMap = new Map<string, number>();
      const imageMap = new Map<string, string>();

      for (const p of products) {
        if (!p.category_id) continue;
        countMap.set(p.category_id, (countMap.get(p.category_id) ?? 0) + 1);
        if (!imageMap.has(p.category_id) && p.images?.[0]) {
          imageMap.set(p.category_id, p.images[0]);
        }
      }

      const enriched: Category[] = catRes.data.map((cat) => ({
        ...cat,
        productCount: countMap.get(cat.id) ?? 0,
        firstImage: imageMap.get(cat.id) ?? "/placeholder.svg",
      }));

      setCategories(enriched);
      setLoading(false);
    }
    fetch();
  }, []);

  return { categories, loading };
}
