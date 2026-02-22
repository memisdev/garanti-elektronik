"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecentProducts } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useRecentProducts() {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["recent-products"],
    queryFn: fetchRecentProducts,
    staleTime: 5 * 60 * 1000,
  });

  return {
    products: data ?? [],
    loading: isLoading,
    error: error ? "Son eklenen ürünler yüklenemedi" : null,
  };
}
