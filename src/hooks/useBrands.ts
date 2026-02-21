"use client";

import { useState, useEffect } from "react";
import { fetchBrands, type Brand } from "@/lib/queries/brands";

export type { Brand };

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands().then((data) => {
      setBrands(data);
      setLoading(false);
    });
  }, []);

  return { brands, loading };
}
