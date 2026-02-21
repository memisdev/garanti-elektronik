"use client";

import { useState, useEffect } from "react";
import { fetchCategories, type Category } from "@/lib/queries/categories";

export type { Category };

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setError("Kategoriler yüklenemedi");
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
}
