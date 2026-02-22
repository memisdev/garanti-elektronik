import { describe, it, expect } from "vitest";
import { normalizeProduct, type ProductRow } from "@/types/product";

function makeRow(overrides: Partial<ProductRow> = {}): ProductRow {
  return {
    id: "1",
    name: "Test Product",
    slug: "test-product",
    code: "TP-001",
    brand_id: "b1",
    category_id: "c1",
    images: ["img1.webp"],
    specs: { voltage: "12V" },
    compatibility: "Model A, Model B",
    is_featured: false,
    featured_order: 0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    brands: { name: "Samsung", slug: "samsung" },
    categories: { name: "Power Boards", slug: "power-boards" },
    ...overrides,
  };
}

describe("normalizeProduct", () => {
  it("maps brand and category convenience fields", () => {
    const product = normalizeProduct(makeRow());
    expect(product.brand).toBe("Samsung");
    expect(product.category).toBe("Power Boards");
  });

  it("defaults brand and category to empty string when relations are null", () => {
    const product = normalizeProduct(makeRow({ brands: null, categories: null }));
    expect(product.brand).toBe("");
    expect(product.category).toBe("");
  });

  it("defaults images to empty array when null", () => {
    const product = normalizeProduct(makeRow({ images: null }));
    expect(product.images).toEqual([]);
  });

  it("defaults specs to empty object when null", () => {
    const product = normalizeProduct(makeRow({ specs: null }));
    expect(product.specs).toEqual({});
  });

  it("defaults specs to empty object when array", () => {
    const product = normalizeProduct(makeRow({ specs: ["invalid"] }));
    expect(product.specs).toEqual({});
  });

  it("defaults is_featured to false when undefined", () => {
    const row = makeRow();
    // Simulate a query result where is_featured might be missing
    const partial = { ...row } as Record<string, unknown>;
    delete partial.is_featured;
    const product = normalizeProduct(partial as unknown as ProductRow);
    expect(product.is_featured).toBe(false);
  });
});
