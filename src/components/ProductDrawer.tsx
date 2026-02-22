"use client";

import { memo } from "react";
import Image from "next/image";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/types/product";
import { siteConfig } from "@/config/site";

interface ProductDrawerProps {
  product: Product | undefined;
  open: boolean;
  onClose: () => void;
}

const ProductDrawer = memo(({ product, open, onClose }: ProductDrawerProps) => {
  if (!product) return null;

  const categoryLabel = product.categories?.name ?? product.category;
  const whatsappMessage = siteConfig.whatsapp.defaultMessage(product.name, product.code ?? undefined);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 overflow-y-auto">
        <div className="p-8 lg:p-10 pt-12">
          {/* Image */}
          <div className="aspect-square bg-card rounded-2xl flex items-center justify-center p-12 mb-8 border border-border/40">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} width={400} height={400} sizes="(max-width: 640px) 90vw, 400px" className="max-h-full max-w-full object-contain mix-blend-multiply" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">Görsel yok</div>
            )}
          </div>

          {/* Info */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-medium bg-card text-foreground px-3 py-1 rounded-full border border-border">{product.brand}</span>
            <span className="text-[11px] text-muted-foreground">{categoryLabel}</span>
          </div>
          <h3 className="text-xl font-bold tracking-[-0.02em] text-foreground mb-1">{product.name}</h3>
          {product.code && (
            <p className="text-sm text-muted-foreground font-mono bg-muted/60 inline-block px-3 py-1 rounded-md mb-6">{product.code}</p>
          )}

          {/* Specs */}
          {Object.keys(product.specs).length > 0 && (
            <div className="mb-8">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4">Teknik Özellikler</p>
              <div className="space-y-0">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex text-sm py-3.5 border-b border-border/50 last:border-b-0">
                    <span className="w-2/5 font-medium text-foreground">{key}</span>
                    <span className="flex-1 text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility */}
          <div className="bg-card rounded-2xl px-5 py-4 mb-8 border border-border/40">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Uyumluluk:</span> {product.compatibility}
            </p>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={siteConfig.social.whatsappUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-foreground hover:bg-primary-hover text-primary-foreground font-semibold py-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            WhatsApp'tan Sor
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
});

ProductDrawer.displayName = "ProductDrawer";

export default ProductDrawer;
