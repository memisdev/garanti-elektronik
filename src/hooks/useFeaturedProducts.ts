"use client";

import { useState, useEffect } from "react";
import { fetchFeaturedProducts } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch featured products:", err);
        setError("Öne çıkan ürünler yüklenemedi");
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}
