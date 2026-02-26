import type { Product } from "@/types/product";

interface ProductSpecsProps {
  product: Product;
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const entries = Object.entries(product.specs);
  if (entries.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-6">
        Teknik Özellikler
      </h2>
      <div className="bg-card rounded-2xl border border-border/40 overflow-hidden">
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`flex text-sm py-4 px-6 ${i < entries.length - 1 ? "border-b border-border/50" : ""}`}
          >
            <span className="w-2/5 font-medium text-foreground">{key}</span>
            <span className="flex-1 text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
