"use client";

import { useState, useEffect, useRef } from "react";
import { searchProducts } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setSuggestions([]); return; }
    const id = ++requestId.current;
    searchProducts(debouncedQuery)
      .then((data) => {
        if (id === requestId.current) setSuggestions(data);
      })
      .catch(() => {
        if (id === requestId.current) setSuggestions([]);
      });
  }, [debouncedQuery]);

  return { query, setQuery, suggestions, debouncedQuery };
}
