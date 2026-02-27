import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getBrandMeta } from "@/lib/metadata";
import { fetchProductsByBrandServer } from "@/lib/queries/productsServer";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("brands").select("slug");
  return (data ?? []).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("name, description")
    .eq("slug", slug)
    .maybeSingle();
  return getBrandMeta(slug, data?.name, data?.description);
}

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch brand
  const { data: brand } = await supabase
    .from("brands")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (!brand) notFound();

  // Fetch products for this brand (server-side)
  const products = await fetchProductsByBrandServer(brand.id);

  return (
    <div>
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", url: siteConfig.url },
          { name: brand.name, url: `${siteConfig.url}/marka/${brand.slug}` },
        ]}
      />

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

      {/* SEO text block */}
      <section className="bg-background">
        <div className="container mx-auto px-6 pt-10 pb-0">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {brand.name} televizyon yedek parça. {brand.name} anakart, mainboard, power board, led bar.
            Orijinal ve test edilmiş {brand.name} TV parçaları.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground text-sm">Bu markaya ait ürün bulunamadı.</p>
              <Link
                href="/urunler"
                className="text-sm text-foreground hover:text-muted-foreground transition-colors mt-4 inline-block"
              >
                ← Tüm Ürünler
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
