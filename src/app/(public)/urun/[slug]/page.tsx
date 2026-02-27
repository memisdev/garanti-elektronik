import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeProduct, type ProductQueryRow } from "@/types/product";
import { getProductMeta } from "@/lib/metadata";
import { generateProductDescription, generateProductFAQs } from "@/lib/product-utils";
import { siteConfig } from "@/config/site";
import { ProductJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";
import ProductHero from "@/components/product/ProductHero";
import ProductDetail from "@/components/product/ProductDetail";
import ProductSpecs from "@/components/product/ProductSpecs";
import ProductDescription from "@/components/product/ProductDescription";
import ProductCompatibility from "@/components/product/ProductCompatibility";
import ProductFAQ from "@/components/product/ProductFAQ";
import RelatedProducts from "@/components/product/RelatedProducts";
import MobileStickyBar from "@/components/product/MobileStickyBar";

export const revalidate = 3600;
export const dynamicParams = true;

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, brands(name, slug), categories(name, slug)")
    .eq("slug", slug)
    .maybeSingle();
  const product = data ? normalizeProduct(data as ProductQueryRow) : undefined;
  return getProductMeta(product);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!SLUG_REGEX.test(slug)) {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, brands(name, slug), categories(name, slug)")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const product = normalizeProduct(data as ProductQueryRow);

  // Fetch related products: same brand first, then same category to fill up to 4
  const relatedIds: string[] = [];
  const relatedProducts: ProductQueryRow[] = [];

  if (product.brand_id) {
    const { data: brandRelated } = await supabase
      .from("products")
      .select("*, brands(name, slug), categories(name, slug)")
      .eq("brand_id", product.brand_id)
      .neq("id", product.id)
      .order("created_at", { ascending: false })
      .limit(4);

    if (brandRelated) {
      for (const p of brandRelated) {
        relatedProducts.push(p as ProductQueryRow);
        relatedIds.push((p as ProductQueryRow).id);
      }
    }
  }

  if (relatedProducts.length < 4 && product.category_id) {
    const remaining = 4 - relatedProducts.length;
    const excludeIds = [product.id, ...relatedIds];

    const query = supabase
      .from("products")
      .select("*, brands(name, slug), categories(name, slug)")
      .eq("category_id", product.category_id)
      .order("created_at", { ascending: false })
      .limit(remaining + excludeIds.length);

    const { data: catRelated } = await query;

    if (catRelated) {
      for (const p of catRelated) {
        const row = p as ProductQueryRow;
        if (!excludeIds.includes(row.id) && relatedProducts.length < 4) {
          relatedProducts.push(row);
        }
      }
    }
  }

  const normalizedRelated = relatedProducts.map(normalizeProduct);
  const description = product.description || generateProductDescription(product);
  const faqs = product.faq ?? generateProductFAQs(product);

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Ürünler", url: `${siteConfig.url}/urunler` },
  ];
  if (product.brands?.slug) {
    breadcrumbItems.push({
      name: product.brand,
      url: `${siteConfig.url}/marka/${product.brands.slug}`,
    });
  }
  breadcrumbItems.push({
    name: product.name,
    url: `${siteConfig.url}/urun/${product.slug}`,
  });

  return (
    <div className="pb-20 md:pb-0">
      <ProductJsonLd product={product} description={description} status={product.status} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQPageJsonLd faqs={faqs} />

      <ProductHero product={product} />

      <section className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <ProductDetail product={product} />
          <ProductSpecs product={product} />
          <ProductDescription description={description} />
          <ProductCompatibility product={product} />
          <ProductFAQ faqs={faqs} />
          <RelatedProducts products={normalizedRelated} />
        </div>
      </section>

      <MobileStickyBar
        productName={product.name}
        productCode={product.code ?? undefined}
      />
    </div>
  );
}
