import type { Metadata } from "next";
import { Suspense } from "react";
import Products from "@/views/Products";
import { getProductsMeta } from "@/lib/metadata";
import { fetchProductsServer } from "@/lib/queries/productsServer";

export const revalidate = 1800;

export const metadata: Metadata = getProductsMeta();

export default async function ProductsPage() {
  // Server-fetch initial products for SSR — Googlebot sees product HTML immediately
  const { products, total } = await fetchProductsServer({ page: 0, pageSize: 24 });

  return (
    <>
      {/* Hidden SEO copy without adding visual spacing before hero */}
      <h1 className="sr-only">TV Yedek Parça Ürünleri</h1>
      <p className="sr-only">
        Samsung, LG, Vestel, Arçelik ve 45+ marka için orijinal TV yedek parça.
        Anakart, power board, T-Con board, LED bar, kumanda ve daha fazlası.
      </p>

      <Suspense>
        <Products initialProducts={products} initialTotal={total} />
      </Suspense>
    </>
  );
}
