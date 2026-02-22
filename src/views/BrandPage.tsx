"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useBrands } from "@/hooks/useBrands";
import { useProducts } from "@/hooks/useProducts";
import { useProduct } from "@/hooks/useProduct";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import ProductCard from "@/components/ProductCard";
import ProductDrawer from "@/components/ProductDrawer";

const BrandPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { brands, loading: brandsLoading } = useBrands();
  const brand = brands.find((b) => b.slug === slug);
  const { products, loading: productsLoading } = useProducts({ brand: brand?.name });
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { product: selectedProduct } = useProduct(selectedSlug ?? undefined);
  const gridRef = useRevealOnScroll();

  if (brandsLoading) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <p className="text-muted-foreground mb-4">Marka bulunamadı.</p>
        <Link href="/" className="text-sm text-foreground hover:text-muted-foreground transition-colors">← Ana Sayfa</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Band */}
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 pt-[152px] pb-20 md:pt-[184px] md:pb-28">
          <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
            <span className="font-light text-primary-foreground/50">Marka:</span>{" "}
            <span className="font-black text-primary-foreground">{brand.name}</span>
          </h1>
          <p className="text-sm text-primary-foreground/60 mt-3">{brand.description}</p>
        </div>
      </section>

      {/* Content */}
      <section ref={gridRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border/40 h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground py-20 text-center text-sm">Bu markaya ait ürün bulunamadı.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <div key={p.id} className={`reveal-on-scroll delay-${Math.min(i + 1, 4)}`}>
                  <ProductCard product={p} onDetail={(s) => setSelectedSlug(s)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductDrawer product={selectedProduct} open={!!selectedSlug} onClose={() => setSelectedSlug(null)} />
    </div>
  );
};

export default BrandPage;
