"use client";

import { useState, useEffect } from "react";
import { fetchCategories, type Category } from "@/lib/queries/categories";

export type { Category };

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return { categories, loading };
}
