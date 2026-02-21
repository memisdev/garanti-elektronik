"use client";

import { useState, useEffect } from "react";
import { fetchProduct } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) { setProduct(undefined); setLoading(false); return; }
    setLoading(true);
    setError(null);
    fetchProduct(slug)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setError("Ürün yüklenemedi");
        setLoading(false);
      });
  }, [slug]);

  return { product, loading, error };
}
