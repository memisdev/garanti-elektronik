"use client";

import { useState, useEffect } from "react";
import { fetchRecentProducts } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useRecentProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
