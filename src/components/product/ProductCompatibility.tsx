import type { Product } from "@/types/product";
import { parseCompatibilityModels } from "@/lib/product-utils";
import { Badge } from "@/components/ui/badge";

interface ProductCompatibilityProps {
  product: Product;
}

export default function ProductCompatibility({
  product,
}: ProductCompatibilityProps) {
  const models = parseCompatibilityModels(product.compatibility);
  if (models.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-6">
        Uyumlu Modeller
      </h2>
      <div className="flex flex-wrap gap-2">
        {models.map((model) => (
          <Badge
            key={model}
            variant="secondary"
            className="text-xs font-mono"
          >
            {model}
          </Badge>
        ))}
      </div>
    </section>
  );
}
