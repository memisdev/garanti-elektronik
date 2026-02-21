"use client";

import { useState, useEffect } from "react";
import { fetchFeaturedProducts } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
