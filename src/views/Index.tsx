"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useState, useCallback, lazy, Suspense } from "react";
import { useBrands } from "@/hooks/useBrands";
import { useProduct } from "@/hooks/useProduct";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useRecentProducts } from "@/hooks/useRecentProducts";
import { useCategories } from "@/hooks/useCategories";
import { siteConfig } from "@/config/site";
import ProductCard from "@/components/ProductCard";
const ProductDrawer = lazy(() => import("@/components/ProductDrawer"));
import HeroSection from "@/components/home/HeroSection";
import BrandMarquee from "@/components/home/BrandMarquee";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useLazyVisible } from "@/hooks/useLazyVisible";
import { usePageContent } from "@/hooks/usePageContent";

const FeaturesSection = lazy(() => import("@/components/home/FeaturesSection"));
const StatsSection = lazy(() => import("@/components/home/StatsSection"));

const ctaDefaults = {
  title: "Doğru parçayı\nbirlikte bulalım.",
  subtitle: "500+ ürün portföyümüzle aradığınız parçayı hızlıca temin ediyoruz.\nUzman ekibimiz her zaman yanınızda.",
};

const Index = () => {
  const { brands } = useBrands();
  const { products: featuredProducts } = useFeaturedProducts();
  const { products: recentProducts } = useRecentProducts();
  const { categories } = useCategories();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { product: selectedProduct } = useProduct(selectedSlug ?? undefined);
  const handleDetail = useCallback((slug: string) => setSelectedSlug(slug), []);

  const featuredIds = new Set(featuredProducts.map((p) => p.id));
  const filteredRecent = recentProducts.filter((p) => !featuredIds.has(p.id));

  const featuredRef = useRevealOnScroll();
  const categoriesRef = useRevealOnScroll();
  const ctaRef = useRevealOnScroll();
  const recentRef = useRevealOnScroll();
  const { content: ctaContent } = usePageContent("home_cta", ctaDefaults);

  const heroProduct = featuredProducts[0];
  const restProducts = featuredProducts.slice(1);
  const whatsappMessage = heroProduct ? siteConfig.whatsapp.defaultMessage(heroProduct.name, heroProduct.code) : "";

  // Lazy render below-fold sections
  const { ref: lazyFeaturesRef, visible: featuresVisible } = useLazyVisible();
  const { ref: lazyRecentRef, visible: recentVisible } = useLazyVisible();

  return (
    <div>
      <OrganizationJsonLd />
      <HeroSection />
      <BrandMarquee brands={brands} />

      {/* ===== Circular Categories ===== */}
      {categories.length > 0 && (
        <section ref={categoriesRef} className="bg-background border-b border-border/40">
          <div className="container mx-auto px-6 py-10 md:py-14">
            <div className="flex justify-center gap-6 md:gap-10 overflow-x-auto scrollbar-hide">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/urunler?category=${cat.slug}`}
                  className={`reveal-on-scroll delay-${Math.min(i + 1, 4)} group flex flex-col items-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-xl`}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-border/40 group-hover:border-accent group-hover:scale-105 transition-all duration-300">
                    <Image
                      src={cat.firstImage || "/placeholder.svg"}
                      alt={cat.name}
                      width={96}
                      height={96}
                      sizes="96px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-medium mt-2 block text-center text-muted-foreground group-hover:text-foreground uppercase tracking-[0.08em] transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Featured Products ===== */}
      {featuredProducts.length > 0 && (
        <section ref={featuredRef} className="bg-background">
          <div className="container mx-auto px-6 py-20 md:py-28">
            <div className="reveal-on-scroll flex items-end justify-between mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                Öne Çıkan Ürünler
              </h2>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors group"
              >
                Tümünü Gör <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>

            {heroProduct && (
              <div className="reveal-on-scroll delay-1 mb-8">
                <article
                  onClick={() => setSelectedSlug(heroProduct.slug)}
                  className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-accent/20 transition-all duration-500 flex flex-col md:flex-row hover-glow card-hover-lift"
                  role="button"
                  tabIndex={0}
                  aria-label={`${heroProduct.name} detaylarını görüntüle`}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedSlug(heroProduct.slug)}
                >
                  <div className="aspect-[4/3] md:aspect-auto md:w-1/2 bg-muted/30 flex items-center justify-center p-12 md:p-20 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent" />
                    {heroProduct.images[0] && (
                      <Image
                        src={heroProduct.images[0]}
                        alt={heroProduct.name}
                        width={490}
                        height={490}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="max-h-[280px] md:max-h-[380px] max-w-full object-contain hero-product-image relative z-10"
                      />
                    )}
                  </div>
                  <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative z-10">
                    <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em] mb-4">
                      {heroProduct.brand}
                    </span>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-foreground mb-3 leading-snug tracking-tight">
                      {heroProduct.name}
                    </h3>
                    {heroProduct.code && (
                      <p className="text-[11px] text-muted-foreground font-mono bg-muted/60 inline-block px-3 py-1 rounded-md mb-6 self-start">
                        {heroProduct.code}
                      </p>
                    )}
                     <div className="flex gap-2.5">
                       <span className="inline-flex items-center justify-center text-[13px] font-semibold py-3 px-7 text-foreground border border-border rounded-lg group-hover:bg-foreground group-hover:text-primary-foreground transition-all duration-300">
                        Detay
                      </span>
                      <a
                        href={siteConfig.social.whatsappUrl(whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary-foreground bg-whatsapp hover:bg-whatsapp-hover py-3 px-7 rounded-lg transition-all duration-300"
                      >
                        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restProducts.map((product, i) => (
                <div key={product.id} className={`reveal-on-scroll delay-${i + 2}`}>
                  <ProductCard product={product} onDetail={handleDetail} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lazy-loaded below-fold sections */}
      <div ref={lazyFeaturesRef}>
        {featuresVisible && (
          <Suspense fallback={null}>
            <FeaturesSection />
            <StatsSection />
          </Suspense>
        )}
      </div>

      {/* ===== CTA ===== */}
      <section ref={ctaRef} className="bg-foreground relative overflow-hidden grain-overlay">
        <div className="relative z-10 container mx-auto px-6 py-24 md:py-36">
          <div className="reveal-on-scroll max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-black text-primary-foreground tracking-[-0.03em] mb-6 leading-[1.05] whitespace-pre-line">
              {ctaContent.title}
            </h2>
            <p className="text-[15px] text-primary-foreground/70 mb-10 max-w-lg mx-auto leading-relaxed whitespace-pre-line">
              {ctaContent.subtitle}
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground font-semibold px-9 py-4 rounded-lg hover:opacity-90 transition-all text-[14px] tracking-wide focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-foreground"
            >
              İletişime Geçin
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Recent Products (lazy) ===== */}
      <div ref={lazyRecentRef}>
        {recentVisible && filteredRecent.length > 0 && (
          <section ref={recentRef} className="bg-background border-t border-border/40">
            <div className="container mx-auto px-6 py-20 md:py-28">
              <div className="reveal-on-scroll flex items-end justify-between mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                  Yeni Eklenenler
                </h2>
                <Link
                  href="/urunler"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                >
                  Tümünü Gör <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRecent.map((product, i) => (
                  <div key={product.id} className={`reveal-on-scroll delay-${Math.min(i + 1, 4)}`}>
                    <ProductCard product={product} onDetail={handleDetail} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Suspense fallback={null}>
        <ProductDrawer
          product={selectedProduct}
          open={!!selectedSlug}
          onClose={() => setSelectedSlug(null)}
        />
      </Suspense>
    </div>
  );
};

export default Index;
