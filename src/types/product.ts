import type { Json } from "@/integrations/supabase/types";

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  brand_id: string | null;
  category_id: string | null;
  images: string[] | null;
  specs: Json | null;
  compatibility: string | null;
  description: string | null;
  faq: Json | null;
  status: string | null;
  is_featured: boolean;
  featured_order: number;
  created_at: string;
  updated_at: string;
  brands?: { name: string; slug: string } | null;
  categories?: { name: string; slug: string } | null;
}

/**
 * Shape returned by Supabase `.select("*, brands(name, slug), categories(name, slug)")`.
 * Accepts the actual query result without requiring `as unknown as` casts.
 */
export type ProductQueryRow = Record<string, unknown> & {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  brand_id: string | null;
  category_id: string | null;
  images: string[] | null;
  specs: Json | null;
  compatibility: string | null;
  description: string | null;
  faq: Json | null;
  status: string | null;
  is_featured: boolean;
  featured_order: number;
  created_at: string;
  updated_at: string;
  brands?: { name: string; slug: string } | null;
  categories?: { name: string; slug: string } | null;
};

export interface ProductFAQItem {
  q: string;
  a: string;
}

/** Normalized product used across public pages */
export interface Product {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  brand_id: string | null;
  category_id: string | null;
  images: string[];
  specs: Record<string, string>;
  compatibility: string | null;
  description: string | null;
  faq: ProductFAQItem[] | null;
  status: string | null;
  is_featured: boolean;
  featured_order: number;
  created_at: string;
  brands?: { name: string; slug: string } | null;
  categories?: { name: string; slug: string } | null;
  // Computed convenience fields
  brand: string;
  category: string;
}

function parseFaq(raw: unknown): ProductFAQItem[] | null {
  if (!Array.isArray(raw)) return null;
  const valid = raw.filter(
    (item): item is ProductFAQItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).q === "string" &&
      typeof (item as Record<string, unknown>).a === "string"
  );
  return valid.length > 0 ? valid : null;
}

export function normalizeProduct(row: ProductRow | ProductQueryRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    code: row.code,
    brand_id: row.brand_id,
    category_id: row.category_id,
    images: row.images ?? [],
    specs: (row.specs && typeof row.specs === "object" && !Array.isArray(row.specs)
      ? row.specs
      : {}) as Record<string, string>,
    compatibility: row.compatibility,
    description: row.description ?? null,
    faq: parseFaq(row.faq),
    status: row.status ?? null,
    is_featured: row.is_featured ?? false,
    featured_order: row.featured_order ?? 0,
    created_at: row.created_at,
    brands: row.brands,
    categories: row.categories,
    brand: row.brands?.name ?? "",
    category: row.categories?.name ?? "",
  };
}
