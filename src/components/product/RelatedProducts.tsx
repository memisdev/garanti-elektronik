"use client";

import { useLazyVisible } from "@/hooks/useLazyVisible";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { ref, visible } = useLazyVisible();

  if (products.length === 0) return null;

  return (
    <section ref={ref} className="mt-16">
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-6">
        Benzer Ürünler
      </h2>
      {visible ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-2xl border border-border/40 h-80 animate-pulse"
            />
          ))}
        </div>
      )}
    </section>
  );
}
