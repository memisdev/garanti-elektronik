import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeProduct, type Product, type ProductRow } from "@/types/product";

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) { setProduct(undefined); return; }
    setLoading(true);
    supabase
      .from("products")
      .select("*, brands(name, slug), categories(name, slug)")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data ? normalizeProduct(data as unknown as ProductRow) : undefined);
        setLoading(false);
      });
  }, [slug]);

  return { product, loading };
}
