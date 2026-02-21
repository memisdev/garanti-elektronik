"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/types/product";
import { siteConfig } from "@/config/site";

interface ProductCardProps {
  product: Product;
  onDetail?: (slug: string) => void;
}

const ProductCard = ({ product, onDetail }: ProductCardProps) => {
  const categoryLabel = product.categories?.name ?? product.category;
  const whatsappMessage = siteConfig.whatsapp.defaultMessage(product.name, product.code);

  return (
    <article className="bg-card rounded-2xl overflow-hidden group card-hover-lift border border-border/40 hover:border-accent/20 transition-all duration-500">
      <div className="aspect-[4/3] bg-muted/20 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/30" />
        <Image
          src={product.images[0]}
          alt={product.name}
          width={363}
          height={272}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 relative z-10"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.15em]">{product.brand}</span>
          <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
          <span className="text-[10px] text-muted-foreground tracking-wide">{categoryLabel}</span>
        </div>
        <h3 className="text-[15px] font-bold text-foreground line-clamp-2 mb-2 leading-snug">{product.name}</h3>
        {product.code && (
          <p className="text-[11px] text-muted-foreground/70 font-mono bg-muted/60 inline-block px-2.5 py-1 rounded-md mb-4">{product.code}</p>
        )}
        <div className="flex gap-2 mt-auto pt-2">
          <button
            onClick={() => onDetail?.(product.slug)}
            className="flex-1 text-[13px] font-semibold text-center py-2.5 text-foreground hover:bg-foreground hover:text-primary-foreground rounded-lg transition-all duration-300 border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20"
            aria-label={`${product.name} detaylarını görüntüle`}
          >
            Detay
          </button>
          <a
            href={siteConfig.social.whatsappUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 flex-1 text-[13px] font-bold text-primary-foreground bg-whatsapp hover:bg-whatsapp-hover py-2.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-whatsapp/50"
            aria-label={`${product.name} için WhatsApp'tan sor`}
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
