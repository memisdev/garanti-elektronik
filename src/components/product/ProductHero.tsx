import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Product } from "@/types/product";

interface ProductHeroProps {
  product: Product;
}

export default function ProductHero({ product }: ProductHeroProps) {
  const categoryLabel = product.categories?.name ?? product.category;

  return (
    <section className="bg-foreground relative overflow-hidden">
      <div className="relative container mx-auto px-6 pt-[136px] pb-16 md:pt-[152px] md:pb-20">
        <Breadcrumb className="mb-5">
          <BreadcrumbList className="text-primary-foreground/50 text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="hover:text-primary-foreground/80">
                  Ana Sayfa
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary-foreground/30" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/urunler"
                  className="hover:text-primary-foreground/80"
                >
                  Ürünler
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {product.brands?.slug && (
              <>
                <BreadcrumbSeparator className="text-primary-foreground/30" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/marka/${product.brands.slug}`}
                      className="hover:text-primary-foreground/80"
                    >
                      {product.brand}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator className="text-primary-foreground/30" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary-foreground/80 font-normal">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-medium bg-primary-foreground/10 text-primary-foreground px-3 py-1 rounded-full">
            {product.brand}
          </span>
          <span className="text-[11px] text-primary-foreground/50">
            {categoryLabel}
          </span>
        </div>
        <h1 className="text-[1.75rem] md:text-[2.5rem] font-black tracking-[-0.04em] text-primary-foreground leading-tight">
          {product.name}
        </h1>
        {product.code && (
          <p className="text-sm text-primary-foreground/60 font-mono mt-2">
            {product.code}
          </p>
        )}
      </div>
    </section>
  );
}
