"use client";

import { useState, useEffect } from "react";
import { fetchProducts, type FetchProductsOptions } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useProducts(options: FetchProductsOptions = {}) {
  const { query, category, brand } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts({ query, category, brand })
      .then(({ products: p, total: t }) => {
        setProducts(p);
        setTotal(t);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Ürünler yüklenemedi");
        setLoading(false);
      });
  }, [query, category, brand]);

  return { products, total, loading, error };
}
