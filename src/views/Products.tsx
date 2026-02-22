"use client";

import { useState, useCallback, useEffect, useRef, useTransition } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 24;

/** Shared filter controls used in both sidebar and mobile sheet */
function FilterControls({
  inputValue,
  onSearchChange,
  cat,
  br,
  categories,
  brands,
  setParam,
  hasFilters,
  onClear,
}: {
  inputValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cat: string;
  br: string;
  categories: { id: string; slug: string; name: string }[];
  brands: { id: string; name: string }[];
  setParam: (key: string, value: string) => void;
  hasFilters: string | boolean;
  onClear: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Arama</label>
        <input
          type="text"
          value={inputValue}
          onChange={onSearchChange}
          placeholder="Parça kodu ara..."
          className="w-full h-11 text-sm px-4 border-0 rounded-xl bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200"
        />
      </div>
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Kategori</label>
        <select
          value={cat}
          onChange={(e) => setParam("category", e.target.value)}
          className="w-full h-11 text-sm px-4 border-0 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200"
        >
          <option value="">Tümü</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Marka</label>
        <select
          value={br}
          onChange={(e) => setParam("brand", e.target.value)}
          className="w-full h-11 text-sm px-4 border-0 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200"
        >
          <option value="">Tümü</option>
          {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
        </select>
      </div>
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors hover:underline focus:outline-none focus:underline"
        >
          <X className="w-3 h-3" aria-hidden="true" /> Filtreleri Temizle
        </button>
      )}
    </div>
  );
}

const Products = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = searchParams.get("q") ?? "";
  const cat = searchParams.get("category") ?? "";
  const br = searchParams.get("brand") ?? "";
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10) || 0);

  const [inputValue, setInputValue] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [isPending, startTransition] = useTransition();

  // Sync inputValue when URL query changes externally (e.g. clear filters)
  useEffect(() => {
    setInputValue(q);
  }, [q]);

  const { products, total, isPlaceholderData } = useProducts({
    query: q,
    category: cat,
    brand: br,
    page,
    pageSize: PAGE_SIZE,
  });
  const { brands } = useBrands();
  const { categories } = useCategories();

  const [drawerSlug, setDrawerSlug] = useState<string | null>(null);
  const { product: drawerProduct } = useProduct(drawerSlug ?? undefined);
  const [sheetOpen, setSheetOpen] = useState(false);
  const gridRef = useRevealOnScroll();

  const handleDetail = useCallback((slug: string) => setDrawerSlug(slug), []);
  const handleCloseDrawer = useCallback(() => setDrawerSlug(null), []);

  const setParam = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (value) sp.set(key, value);
      else sp.delete(key);
      // Reset page on filter changes
      if (key !== "page") sp.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${sp.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setParam("q", value);
      }, 300);
    },
    [setParam],
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const goToPage = useCallback(
    (p: number) => {
      setParam("page", p > 0 ? String(p) : "");
    },
    [setParam],
  );

  const clearAllFilters = useCallback(() => {
    setInputValue("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasFilters = q || cat || br;

  // Count active filters for badge
  const activeFilterCount = [q, cat, br].filter(Boolean).length;

  // Build active filter chip list
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (q) activeChips.push({ label: `"${q}"`, onRemove: () => { setInputValue(""); setParam("q", ""); } });
  if (cat) {
    const catName = categories.find((c) => c.slug === cat)?.name ?? cat;
    activeChips.push({ label: catName, onRemove: () => setParam("category", "") });
  }
  if (br) activeChips.push({ label: br, onRemove: () => setParam("brand", "") });

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
          {/* Mobile: filter button + active chips */}
          <div className="lg:hidden mb-6 space-y-3">
            <div className="flex items-center justify-end">
              <button
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2 text-sm font-medium border border-border rounded-full px-5 py-2.5 hover:bg-card transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <Filter className="w-4 h-4" aria-hidden="true" />
                Filtreler
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-foreground text-primary-foreground text-[11px] font-bold w-5 h-5 rounded-full inline-flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-card border border-border rounded-full px-3 py-1.5"
                  >
                    {chip.label}
                    <button
                      onClick={chip.onRemove}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`${chip.label} filtresini kaldır`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {activeChips.length > 1 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                  >
                    Tümünü temizle
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile filter sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filtreler</SheetTitle>
              </SheetHeader>
              <div className="py-4 overflow-y-auto">
                <FilterControls
                  inputValue={inputValue}
                  onSearchChange={handleSearchChange}
                  cat={cat}
                  br={br}
                  categories={categories}
                  brands={brands}
                  setParam={setParam}
                  hasFilters={hasFilters}
                  onClear={clearAllFilters}
                />
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 text-sm font-medium py-3 rounded-xl border border-border hover:bg-card transition-colors"
                  >
                    Temizle
                  </button>
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="flex-1 text-sm font-semibold py-3 rounded-xl bg-foreground text-primary-foreground hover:opacity-90 transition-all"
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex gap-10">
            {/* Filters Sidebar — desktop only */}
            <aside
              className="hidden lg:block w-60 shrink-0"
              aria-label="Ürün filtreleri"
            >
              <div className="reveal-on-scroll bg-card rounded-2xl p-7 sticky top-24 border border-border/40">
                <FilterControls
                  inputValue={inputValue}
                  onSearchChange={handleSearchChange}
                  cat={cat}
                  br={br}
                  categories={categories}
                  brands={brands}
                  setParam={setParam}
                  hasFilters={hasFilters}
                  onClear={clearAllFilters}
                />
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              <div
                className="transition-opacity duration-200"
                style={{ opacity: isPending || isPlaceholderData ? 0.6 : 1 }}
              >
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    {page > 0 && (
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); goToPage(page - 1); }} />
                      </PaginationItem>
                    )}
                    {getPageNumbers(page, totalPages).map((p, i) =>
                      p === "ellipsis" ? (
                        <PaginationItem key={`e-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === page}
                            onClick={(e) => { e.preventDefault(); goToPage(p); }}
                          >
                            {p + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    {page < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); goToPage(page + 1); }} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductDrawer product={drawerProduct} open={!!drawerSlug} onClose={handleCloseDrawer} />
    </div>
  );
};

/** Compute page numbers with ellipsis for compact pagination */
function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: (number | "ellipsis")[] = [0];

  if (current > 2) pages.push("ellipsis");

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push("ellipsis");

  pages.push(total - 1);
  return pages;
}

export default Products;
