import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeProduct, type Product, type ProductRow } from "@/types/product";

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*, brands(name, slug), categories(name, slug)")
      .eq("is_featured", true)
      .order("featured_order")
      .limit(4)
      .then(({ data }) => {
        setProducts((data as unknown as ProductRow[] | null)?.map(normalizeProduct) ?? []);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}
