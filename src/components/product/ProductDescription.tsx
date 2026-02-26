import type { Product } from "@/types/product";
import { generateProductDescription } from "@/lib/product-utils";

interface ProductDescriptionProps {
  product: Product;
}

export default function ProductDescription({
  product,
}: ProductDescriptionProps) {
  const description = generateProductDescription(product);

  return (
    <section className="mt-16">
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-6">
        Ürün Açıklaması
      </h2>
      <div className="bg-card rounded-2xl border border-border/40 p-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
