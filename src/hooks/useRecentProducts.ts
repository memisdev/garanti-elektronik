"use client";

import { useState, useEffect } from "react";
import { fetchRecentProducts } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useRecentProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recent products:", err);
        setError("Son eklenen ürünler yüklenemedi");
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}
