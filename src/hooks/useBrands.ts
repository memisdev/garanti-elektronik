"use client";

import { useState, useEffect } from "react";
import { fetchBrands, type Brand } from "@/lib/queries/brands";

export type { Brand };

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands()
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch brands:", err);
        setError("Markalar yüklenemedi");
        setLoading(false);
      });
  }, []);

  return { brands, loading, error };
}
