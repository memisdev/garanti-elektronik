"use client";

import { useState, useEffect } from "react";
import { fetchProducts, type FetchProductsOptions } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useProducts(options: FetchProductsOptions = {}) {
  const { query, category, brand } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ query, category, brand }).then(({ products: p, total: t }) => {
      setProducts(p);
      setTotal(t);
      setLoading(false);
    });
  }, [query, category, brand]);

  return { products, total, loading };
}
