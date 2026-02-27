import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getCategorySEO } from "@/lib/categoryMeta";
import { fetchProductsByCategoryServer } from "@/lib/queries/productsServer";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data } = await supabase.from("categories").select("slug");
    return (data ?? []).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: category } = await supabase
        .from("categories")
        .select("name")
        .eq("slug", slug)
        .maybeSingle();

    const seo = getCategorySEO(slug, category?.name);

    return {
        title: `${seo.title} | Garanti Elektronik`,
        description: seo.description,
        keywords: seo.keywords,
        alternates: { canonical: `/kategori/${slug}` },
        openGraph: {
            title: `${seo.title} | Garanti Elektronik`,
            description: seo.description,
        },
        twitter: {
            card: "summary_large_image",
            title: `${seo.title} | Garanti Elektronik`,
            description: seo.description,
        },
    };
}

/** Top brands shown as cross-links on category pages */
const TOP_BRANDS = [
    { name: "Samsung", slug: "samsung" },
    { name: "LG", slug: "lg" },
    { name: "Vestel", slug: "vestel" },
    { name: "Arçelik", slug: "arcelik" },
    { name: "Beko", slug: "beko" },
    { name: "Philips", slug: "philips" },
    { name: "Grundig", slug: "grundig" },
];

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch category
    const { data: category } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", slug)
        .maybeSingle();

    if (!category) notFound();

    const seo = getCategorySEO(slug, category.name);

    // Fetch products for this category (server-side)
    const products = await fetchProductsByCategoryServer(category.id);

    return (
        <div>
            {/* Breadcrumb JSON-LD */}
            <BreadcrumbJsonLd
                items={[
                    { name: "Ana Sayfa", url: siteConfig.url },
                    { name: category.name, url: `${siteConfig.url}/kategori/${category.slug}` },
                ]}
            />

            {/* Hero Band */}
            <section className="bg-foreground relative overflow-hidden">
                <div className="relative container mx-auto px-6 pt-[152px] pb-20 md:pt-[184px] md:pb-28">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="accent-bar" />
                        <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">
                            Kategori
                        </span>
                    </div>
                    <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
                        <span className="font-black text-primary-foreground">{seo.title}</span>
                    </h1>
                    <p className="text-sm text-primary-foreground/50 mt-3">
                        {products.length} ürün bulundu
                    </p>
                </div>
            </section>

            {/* SEO Description */}
            <section className="bg-background">
                <div className="container mx-auto px-6 pt-10 pb-0">
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                        {seo.description}
                    </p>
                </div>
            </section>

            {/* Product Grid */}
            <section className="bg-background">
                <div className="container mx-auto px-6 py-16 md:py-24">
                    {products.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground text-sm">Bu kategoride ürün bulunamadı.</p>
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

            {/* Brand Cross-Links */}
            <section className="bg-card border-t border-border/40">
                <div className="container mx-auto px-6 py-12">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                        Popüler Markalar
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {TOP_BRANDS.map((brand) => (
                            <Link
                                key={brand.slug}
                                href={`/marka/${brand.slug}`}
                                className="text-sm font-medium text-foreground/80 hover:text-foreground bg-background border border-border/60 rounded-full px-5 py-2 transition-colors hover:border-foreground/20"
                            >
                                {brand.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
