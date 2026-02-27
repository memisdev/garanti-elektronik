"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts, type FetchProductsOptions } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export interface UseProductsOptions extends FetchProductsOptions {
  /** SSR initial data — passed as TanStack Query initialData to avoid re-fetch on first render */
  initialData?: { products: Product[]; total: number };
}

export function useProducts(options: UseProductsOptions = {}) {
  const { query, category, brand, page = 0, pageSize = 24, initialData } = options;

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["products", { query, category, brand, page, pageSize }],
    queryFn: () => fetchProducts({ query, category, brand, page, pageSize }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...(initialData ? { initialData } : {}),
  });

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error: error ? "Ürünler yüklenemedi" : null,
    isPlaceholderData,
  };
}
