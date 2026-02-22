"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useProduct(slug: string | undefined) {
  const { data, isLoading, error } = useQuery<Product | undefined>({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug as string),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  return {
    product: data,
    loading: isLoading,
    error: error ? "Ürün yüklenemedi" : null,
  };
}
