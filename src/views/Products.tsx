"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import ProductCard from "@/components/ProductCard";
import ProductDrawer from "@/components/ProductDrawer";
import EmptyState from "@/components/EmptyState";
import { useProduct } from "@/hooks/useProduct";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { Filter, X } from "lucide-react";

const Products = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = searchParams.get("q") ?? "";
  const cat = searchParams.get("category") ?? "";
  const br = searchParams.get("brand") ?? "";

  const { products, total } = useProducts({ query: q, category: cat, brand: br });
  const { brands } = useBrands();
  const { categories } = useCategories();

  const [drawerSlug, setDrawerSlug] = useState<string | null>(null);
  const { product: drawerProduct } = useProduct(drawerSlug ?? undefined);
  const [showFilters, setShowFilters] = useState(false);
  const gridRef = useRevealOnScroll();

  const handleDetail = useCallback((slug: string) => setDrawerSlug(slug), []);
  const handleCloseDrawer = useCallback(() => setDrawerSlug(null), []);

  const setParam = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const hasFilters = q || cat || br;

  return (
    <div>
      {/* Hero Band */}
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 pt-[152px] pb-20 md:pt-[184px] md:pb-28">
          <div className="flex items-center gap-3 mb-5">
            <div className="accent-bar" />
            <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">Ürün Kataloğu</span>
          </div>
          <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
            <span className="font-light text-primary-foreground/60">Tüm</span>{" "}
            <span className="font-black text-primary-foreground">ürünlerimiz</span>
          </h1>
          <p className="text-sm text-primary-foreground/50 mt-3">{total} ürün bulundu</p>
        </div>
      </section>

      {/* Content */}
      <section ref={gridRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center justify-end mb-8 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium border border-border rounded-full px-5 py-2.5 hover:bg-card transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20"
              aria-expanded={showFilters}
              aria-controls="filters-sidebar"
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              Filtreler
            </button>
          </div>

          <div className="flex gap-10">
            {/* Filters Sidebar */}
            <aside
              id="filters-sidebar"
              className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-60 shrink-0`}
              aria-label="Ürün filtreleri"
            >
              <div className="reveal-on-scroll bg-card rounded-2xl p-7 space-y-6 sticky top-24 border border-border/40">
                <div>
                  <label htmlFor="search-filter" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Arama</label>
                  <input
                    id="search-filter"
                    type="text" value={q} onChange={(e) => setParam("q", e.target.value)}
                    placeholder="Parça kodu ara..."
                    className="w-full h-11 text-sm px-4 border-0 rounded-xl bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="category-filter" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Kategori</label>
                  <select id="category-filter" value={cat} onChange={(e) => setParam("category", e.target.value)}
                    className="w-full h-11 text-sm px-4 border-0 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200">
                    <option value="">Tümü</option>
                    {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="brand-filter" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Marka</label>
                  <select id="brand-filter" value={br} onChange={(e) => setParam("brand", e.target.value)}
                    className="w-full h-11 text-sm px-4 border-0 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200">
                    <option value="">Tümü</option>
                    {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                {hasFilters && (
                  <button onClick={() => router.push(pathname, { scroll: false })}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors hover:underline focus:outline-none focus:underline">
                    <X className="w-3 h-3" aria-hidden="true" /> Filtreleri Temizle
                  </button>
                )}
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product, i) => (
                    <div key={product.id} className={`reveal-on-scroll delay-${Math.min(i + 1, 4)}`}>
                      <ProductCard product={product} onDetail={handleDetail} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductDrawer product={drawerProduct} open={!!drawerSlug} onClose={handleCloseDrawer} />
    </div>
  );
};

export default Products;
