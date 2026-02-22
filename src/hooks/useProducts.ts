"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts, type FetchProductsOptions } from "@/lib/queries/products";

export function useProducts(options: FetchProductsOptions = {}) {
  const { query, category, brand, page = 0, pageSize = 24 } = options;

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["products", { query, category, brand, page, pageSize }],
    queryFn: () => fetchProducts({ query, category, brand, page, pageSize }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error: error ? "Ürünler yüklenemedi" : null,
    isPlaceholderData,
  };
}
