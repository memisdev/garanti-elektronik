
# Next.js Migration Icin On Hazirlik

Bu plan, mevcut React + Vite projesini Claude Code ile Next.js'e tasimadan once yapilacak **kod duzenleme ve ayristirma** calismasini kapsar. Amac: migration sirasinda en az surpriz, en temiz gecis.

---

## 1. Veri Erisim Katmanini (Data Access Layer) Ayristirma

Mevcut hook'lar (`useBrands`, `useCategories`, `useProducts`, `useProduct`, `useFeaturedProducts`, `useRecentProducts`, `useSearch`) dogrudan Supabase'i cagirir ve `useState`/`useEffect` ile yonetir. Next.js'te bu sorgular server component'lerde calisacak.

**Yapilacak:**
- `src/lib/queries/` klasoru olusturulacak
- Her hook icin **saf async fonksiyon** cikarilacak (React'tan bagimsiz):
  - `src/lib/queries/products.ts` -- `fetchProducts()`, `fetchProduct()`, `fetchFeaturedProducts()`, `fetchRecentProducts()`, `searchProducts()`
  - `src/lib/queries/brands.ts` -- `fetchBrands()`
  - `src/lib/queries/categories.ts` -- `fetchCategories()`
  - `src/lib/queries/page-contents.ts` -- `fetchPageContent()`
  - `src/lib/queries/site-settings.ts` -- `fetchSiteSettings()`
- Mevcut hook'lar bu fonksiyonlari import edip kullanacak sekilde guncellenir (eski davranis korunur)

Ornek:
```typescript
// src/lib/queries/products.ts
import { supabase } from "@/integrations/supabase/client";
import { normalizeProduct, type Product, type ProductRow } from "@/types/product";

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*, brands(name, slug), categories(name, slug)")
    .eq("is_featured", true)
    .order("featured_order")
    .limit(4);
  return (data as unknown as ProductRow[] | null)?.map(normalizeProduct) ?? [];
}
```

Hook guncellemesi:
```typescript
// src/hooks/useFeaturedProducts.ts
import { fetchFeaturedProducts } from "@/lib/queries/products";
export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetchFeaturedProducts().then(setProducts); }, []);
  return { products };
}
```

---

## 2. Link Bilesenini Soyutlama

Projede `react-router-dom`'dan `Link` ve `useNavigate` kullanan ~20+ dosya var. Migration sirasinda bunlarin hepsini `next/link` ve `next/navigation`'a degistirmek gerekecek.

**Yapilacak:**
- `src/components/AppLink.tsx` olusturulacak -- `react-router-dom`'un `Link`'ini sarar
- Tum sayfa ve bilesen dosyalarinda `Link` import'u `AppLink`'e cevrilecek
- Migration sirasinda sadece `AppLink.tsx` icindeki import degisecek

```typescript
// src/components/AppLink.tsx
import { Link, type LinkProps } from "react-router-dom";
export default function AppLink(props: LinkProps) {
  return <Link {...props} />;
}
```

---

## 3. SEO Metadata'yi Ayristirma

`usePageMeta` hook'u `document.title` ile calisir. Next.js'te `generateMetadata` kullanilacak.

**Yapilacak:**
- `src/lib/metadata.ts` olusturulacak -- her sayfanin meta bilgisini donduren saf fonksiyonlar
- Ornek: `getProductMeta(product)`, `getIndexMeta()`, `getProductsMeta()`
- Mevcut `usePageMeta` calismaya devam eder ama meta verileri bu fonksiyonlardan gelir

```typescript
// src/lib/metadata.ts
export function getIndexMeta() {
  return {
    title: "Garanti Elektronik | Orijinal TV Yedek Parca",
    description: "Samsung, LG, Vestel ve daha fazlasi icin..."
  };
}
```

---

## 4. Bilesen Siniflandirmasi: Client vs Server

Next.js'te hangi bilesenin client, hangisinin server olacagini onceden belirlemek migration'i hizlandirir.

**Yapilacak:**
- Interaktif bilesenlere (state, event handler, browser API kullananlar) `"use client"` yorumu eklenecek (su an zarar vermez, Vite bunu yorum olarak gorur):
  - `Header.tsx`, `SearchBar.tsx`, `ProductDrawer.tsx`, `ProductCard.tsx` (onClick), `BrandMarquee.tsx`, `ScrollToTop.tsx`
  - Tum admin sayfalari
  - `useRevealOnScroll`, `useLazyVisible` kullanan bilesenler
- Server-uyumlu bilesenler isaretlenmez: `Logo.tsx`, `Footer.tsx`, `JsonLd.tsx`, `EmptyState.tsx`

---

## 5. Statik Icerik Dosyalarini Organize Etme

**Yapilacak:**
- `src/data/` klasorundeki statik veriler (brands.ts, categories.ts, products.ts, shipping-companies.ts) icerikleri kontrol edilecek -- eger bunlar sadece fallback/seed ise "data" klasorunde kalabilir
- `src/config/site.ts` degisiklik gerektirmez, Next.js'te de aynen kullanilabilir

---

## 6. Supabase Client Yapisini Hazirla

Next.js'te iki farkli Supabase client gerekecek (browser + server). Buna hazirlik olarak:

**Yapilacak:**
- `src/lib/supabase/` klasoru olusturulacak
- `src/lib/supabase/client.ts` -- mevcut browser client'i re-export eder
- `src/lib/supabase/server.ts` -- su an icin placeholder, migration'da `createServerClient` ile doldurulacak
- Tum import'lar `@/integrations/supabase/client` yerine `@/lib/supabase/client` kullanacak sekilde guncellenir

**Not:** `src/integrations/supabase/client.ts` dosyasina dokunulmaz (otomatik uretiliyor). Sadece bir ara katman eklenir.

---

## 7. CSS ve Tailwind Hazirlik

**Yapilacak:**
- `src/index.css` icindeki `@tailwind` direktifleri ve custom CSS, Next.js'e birebir tasinabilir durumda -- degisiklik gerekmez
- `tailwind.config.ts` icerigi kontrol edilip Next.js uyumlu `content` path'leri icin not birakilacak (yorum olarak)

---

## Dosya Degisiklik Ozeti

| Islem | Dosya |
|-------|-------|
| Yeni | `src/lib/queries/products.ts` |
| Yeni | `src/lib/queries/brands.ts` |
| Yeni | `src/lib/queries/categories.ts` |
| Yeni | `src/lib/queries/page-contents.ts` |
| Yeni | `src/lib/queries/site-settings.ts` |
| Yeni | `src/lib/metadata.ts` |
| Yeni | `src/lib/supabase/client.ts` (re-export) |
| Yeni | `src/lib/supabase/server.ts` (placeholder) |
| Yeni | `src/components/AppLink.tsx` |
| Guncelleme | `src/hooks/useBrands.ts` (query fonksiyonunu import et) |
| Guncelleme | `src/hooks/useCategories.ts` (query fonksiyonunu import et) |
| Guncelleme | `src/hooks/useProducts.ts` (query fonksiyonunu import et) |
| Guncelleme | `src/hooks/useProduct.ts` (query fonksiyonunu import et) |
| Guncelleme | `src/hooks/useFeaturedProducts.ts` (query fonksiyonunu import et) |
| Guncelleme | `src/hooks/useRecentProducts.ts` (query fonksiyonunu import et) |
| Guncelleme | `src/hooks/useSearch.ts` (query fonksiyonunu import et) |
| Guncelleme | `src/hooks/usePageContent.ts` (query fonksiyonunu import et) |
| Guncelleme | ~15 bilesen dosyasi (`"use client"` yorumu ekleme) |

---

## Onemli Notlar

- Bu degisiklikler mevcut uygulamayi **bozmaz** -- tamamen geriye uyumlu
- `"use client"` ifadesi Vite'ta sadece bir string literal olarak gorulur, hicbir etkisi yoktur
- Data access layer ayristirmasi, Next.js server component'lerinde dogrudan `fetchProducts()` cagirmayi mumkun kilar
- AppLink soyutlamasi sayesinde migration'da tek dosya degisikligi yeterli olur
