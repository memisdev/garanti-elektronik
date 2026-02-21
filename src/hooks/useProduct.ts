"use client";

import { useState, useEffect } from "react";
import { fetchProduct } from "@/lib/queries/products";
import type { Product } from "@/types/product";

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) { setProduct(undefined); return; }
    setLoading(true);
    fetchProduct(slug).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [slug]);

  return { product, loading };
}
