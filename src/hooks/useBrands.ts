"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBrands, type Brand } from "@/lib/queries/brands";

export type { Brand };

export function useBrands() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 10 * 60 * 1000,
  });

  return {
    brands: data ?? [],
    loading: isLoading,
    error: error ? "Markalar yüklenemedi" : null,
  };
}
