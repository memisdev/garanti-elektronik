import type { Metadata } from "next";
import { Suspense } from "react";
import Products from "@/views/Products";
import { getProductsMeta } from "@/lib/metadata";

export const revalidate = 1800;

const meta = getProductsMeta();
export const metadata: Metadata = {
  title: "Ürünler",
  description: meta.description,
};

export default function ProductsPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  );
}
