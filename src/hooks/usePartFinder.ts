import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TvModel {
  id: string;
  model_number: string;
  brand_id: string | null;
  screen_size: string | null;
  year: string | null;
  brand_name?: string;
}

interface CompatibleProduct {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  images: string[] | null;
  compatibility: string | null;
  specs: Record<string, string> | null;
  brand_name: string | null;
  category_name: string | null;
  category_slug: string | null;
  notes: string | null;
}

export function useModelSearch(query: string) {
  const [models, setModels] = useState<TvModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setModels([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("tv_models")
        .select("id, model_number, brand_id, screen_size, year, brands(name)")
        .ilike("model_number", `%${query}%`)
        .limit(10);

      if (data) {
        setModels(
          data.map((d: any) => ({
            id: d.id,
            model_number: d.model_number,
            brand_id: d.brand_id,
            screen_size: d.screen_size,
            year: d.year,
            brand_name: d.brands?.name ?? null,
          }))
        );
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { models, loading };
}

export function useCompatibleProducts(modelId: string | null) {
  const [products, setProducts] = useState<CompatibleProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!modelId) {
      setProducts([]);
      return;
    }

    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("model_product_compatibility")
        .select(
          "notes, products(id, name, slug, code, images, compatibility, specs, brands(name), categories(name, slug))"
        )
        .eq("tv_model_id", modelId);

      if (data) {
        setProducts(
          data.map((d: any) => ({
            id: d.products.id,
            name: d.products.name,
            slug: d.products.slug,
            code: d.products.code,
            images: d.products.images,
            compatibility: d.products.compatibility,
            specs: d.products.specs,
            brand_name: d.products.brands?.name ?? null,
            category_name: d.products.categories?.name ?? null,
            category_slug: d.products.categories?.slug ?? null,
            notes: d.notes,
          }))
        );
      }
      setLoading(false);
    })();
  }, [modelId]);

  return { products, loading };
}
