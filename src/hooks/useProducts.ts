import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeProduct, type Product, type ProductRow } from "@/types/product";
import { escapeIlike } from "@/lib/escapeIlike";

interface UseProductsOptions {
  query?: string;
  category?: string;
  brand?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { query, category, brand } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let q = supabase
        .from("products")
        .select("*, brands(name, slug), categories(name, slug)", { count: "exact" });

      if (category) {
        // category filter by slug
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

      const { data, count } = await q.order("created_at", { ascending: false });
      setProducts((data as unknown as ProductRow[] | null)?.map(normalizeProduct) ?? []);
      setTotal(count ?? 0);
      setLoading(false);
    }
    fetch();
  }, [query, category, brand]);

  return { products, total, loading };
}
