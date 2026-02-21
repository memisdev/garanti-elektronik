"use client";

import { useState, useEffect } from "react";
import { searchProducts } from "@/lib/queries/products";
import type { Product } from "@/types/product";

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
    searchProducts(debouncedQuery)
      .then(setSuggestions)
      .catch(() => setSuggestions([]));
  }, [debouncedQuery]);

  return { query, setQuery, suggestions, debouncedQuery };
}
