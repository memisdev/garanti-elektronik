"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories, type Category } from "@/lib/queries/categories";

export type { Category };

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  return {
    categories: data ?? [],
    loading: isLoading,
    error: error ? "Kategoriler yüklenemedi" : null,
  };
}
