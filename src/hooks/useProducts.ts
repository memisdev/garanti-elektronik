"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type FetchProductsOptions } from "@/lib/queries/products";

export function useProducts(options: FetchProductsOptions = {}) {
  const { query, category, brand } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", { query, category, brand }],
    queryFn: () => fetchProducts({ query, category, brand }),
    staleTime: 5 * 60 * 1000,
  });

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error: error ? "Ürünler yüklenemedi" : null,
  };
}
