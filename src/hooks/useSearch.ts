import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeProduct, type Product, type ProductRow } from "@/types/product";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setSuggestions([]); return; }
    supabase
      .from("products")
      .select("*, brands(name, slug), categories(name, slug)")
      .or(`name.ilike.%${debouncedQuery}%,code.ilike.%${debouncedQuery}%`)
      .limit(8)
      .then(({ data }) => {
        setSuggestions((data as unknown as ProductRow[] | null)?.map(normalizeProduct) ?? []);
      });
  }, [debouncedQuery]);

  return { query, setQuery, suggestions, debouncedQuery };
}
