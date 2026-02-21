"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageMeta } from "@/hooks/usePageMeta";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ProductJsonLd } from "@/components/seo/JsonLd";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product } = useProduct(slug);
  const contentRef = useRevealOnScroll();
  usePageMeta({ title: product ? `${product.name} | Garanti Elektronik` : "Ürün | Garanti Elektronik", description: product ? `${product.name} - ${product.compatibility}` : "Ürün detayları" });

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <p className="text-muted-foreground mb-4">Ürün bulunamadı.</p>
        <Link href="/urunler" className="text-sm text-foreground hover:text-muted-foreground transition-colors">← Ürünlere Dön</Link>
      </div>
    );
  }

  const categoryLabel = product.categories?.name ?? product.category;
  const whatsappMessage = siteConfig.whatsapp.defaultMessage(product.name, product.code);

  return (
    <div>
      <ProductJsonLd
        name={product.name}
        description={product.compatibility}
        image={product.images[0]}
        sku={product.code}
        brand={product.brand}
        url={`${siteConfig.url}/urun/${product.slug}`}
      />

      {/* Hero Band */}
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-medium bg-primary-foreground/10 text-primary-foreground px-3 py-1 rounded-full">{product.brand}</span>
            <span className="text-[11px] text-primary-foreground/50">{categoryLabel}</span>
          </div>
          <h1 className="text-[1.75rem] md:text-[2.5rem] font-black tracking-[-0.04em] text-primary-foreground leading-tight">{product.name}</h1>
          {product.code && <p className="text-sm text-primary-foreground/60 font-mono mt-2">{product.code}</p>}
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div className="reveal-on-scroll aspect-square bg-card rounded-2xl flex items-center justify-center p-12 border border-border/40">
              <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="reveal-on-scroll delay-1">
              {Object.keys(product.specs).length > 0 && (
                <div className="mb-8">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4">Teknik Özellikler</p>
                  <div className="space-y-0">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex text-sm py-3.5 border-b border-border last:border-b-0">
                        <span className="w-2/5 font-medium text-foreground">{key}</span>
                        <span className="flex-1 text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card rounded-2xl px-6 py-4 mb-8 border border-border/40">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Uyumluluk:</span> {product.compatibility}
                </p>
              </div>

              <a
                href={siteConfig.social.whatsappUrl(whatsappMessage)}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-foreground hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-foreground/30"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                WhatsApp'tan Sor
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
