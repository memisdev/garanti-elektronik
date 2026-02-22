"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProducts } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useFeaturedProducts() {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["featured-products"],
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });

  return {
    products: data ?? [],
    loading: isLoading,
    error: error ? "Öne çıkan ürünler yüklenemedi" : null,
  };
}
