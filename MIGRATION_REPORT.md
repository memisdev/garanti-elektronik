# Garanti Elektronik — Next.js Migration Raporu

> **Tarih:** 2026-02-21  
> **Kaynak:** React 18 + Vite + TypeScript (SPA)  
> **Hedef:** Next.js 15 App Router + TypeScript (SSR/SSG/ISR)  
> **Hazırlayan:** Lovable AI

---

## İçindekiler

1. [Proje Kimlik Kartı](#1-proje-kimlik-kartı)
2. [Mevcut Teknoloji Yığını](#2-mevcut-teknoloji-yığını)
3. [Dizin Yapısı (Tam Ağaç)](#3-dizin-yapısı)
4. [Sayfa Envanteri](#4-sayfa-envanteri)
5. [Veritabanı Şeması](#5-veritabanı-şeması)
6. [Edge Functions (Backend)](#6-edge-functions)
7. [Tasarım Sistemi ve UI/UX](#7-tasarım-sistemi-ve-uiux)
8. [SEO Yapısı](#8-seo-yapısı)
9. [Özel Hook'lar ve Yardımcı Fonksiyonlar](#9-özel-hooklar-ve-yardımcı-fonksiyonlar)
10. [Migration Checklist ve Dikkat Edilecekler](#10-migration-checklist)
11. [Önerilen Next.js Dizin Yapısı](#11-önerilen-nextjs-dizin-yapısı)

---

## 1. Proje Kimlik Kartı

| Alan | Değer |
|------|-------|
| **Site Adı** | Garanti Elektronik |
| **Kısa Ad** | GE |
| **Amaç** | TV yedek parça ve anakart B2B/B2C e-ticaret kataloğu + teknik servis triage asistanı |
| **Hedef Kitle** | TV teknik servis ustaları, profesyonel elektronik tamirciler, son kullanıcılar |
| **URL** | https://garantielektronik.com |
| **Dil** | Türkçe (tr) |
| **Mevcut Stack** | React 18 + Vite + TypeScript + Tailwind CSS + Supabase |
| **Hedef Stack** | Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase |
| **Hosting** | Vercel |
| **DNS** | Cloudflare |

### İş Modeli
- Fiyat sitede gösterilmez; kullanıcılar WhatsApp üzerinden iletişime geçer
- Ürünler markaya, kategoriye göre filtrelenir
- AI destekli "Parça Bulucu" servisi ile teknik triage yapılır
- Admin paneli ile ürün, marka, kategori, SEO, medya yönetimi yapılır

---

## 2. Mevcut Teknoloji Yığını

### Core
| Paket | Sürüm | Açıklama |
|-------|-------|----------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | DOM renderer |
| react-router-dom | ^6.30.1 | Client-side routing |
| typescript | (tsconfig) | Type safety |
| vite | (config) | Build tool + dev server |
| tailwindcss | (config) | Utility-first CSS |
| tailwindcss-animate | ^1.0.7 | Animation utilities |

### State & Data
| Paket | Sürüm | Açıklama |
|-------|-------|----------|
| @tanstack/react-query | ^5.83.0 | Server state management |
| @supabase/supabase-js | ^2.97.0 | Supabase client |
| react-hook-form | ^7.61.1 | Form management |
| @hookform/resolvers | ^3.10.0 | Form validation resolvers |
| zod | ^3.25.76 | Schema validation |

### UI Kit: shadcn/ui (Radix UI tabanlı)
| Paket | Açıklama |
|-------|----------|
| @radix-ui/react-accordion | Accordion bileşeni |
| @radix-ui/react-alert-dialog | Alert dialog |
| @radix-ui/react-aspect-ratio | Aspect ratio container |
| @radix-ui/react-avatar | Avatar bileşeni |
| @radix-ui/react-checkbox | Checkbox |
| @radix-ui/react-collapsible | Collapsible panel |
| @radix-ui/react-context-menu | Context menu |
| @radix-ui/react-dialog | Dialog/Modal |
| @radix-ui/react-dropdown-menu | Dropdown menu |
| @radix-ui/react-hover-card | Hover card |
| @radix-ui/react-label | Label |
| @radix-ui/react-menubar | Menubar |
| @radix-ui/react-navigation-menu | Navigation menu |
| @radix-ui/react-popover | Popover |
| @radix-ui/react-progress | Progress bar |
| @radix-ui/react-radio-group | Radio group |
| @radix-ui/react-scroll-area | Scroll area |
| @radix-ui/react-select | Select dropdown |
| @radix-ui/react-separator | Separator |
| @radix-ui/react-slider | Slider |
| @radix-ui/react-slot | Slot (composition) |
| @radix-ui/react-switch | Switch toggle |
| @radix-ui/react-tabs | Tabs |
| @radix-ui/react-toast | Toast notification |
| @radix-ui/react-toggle | Toggle button |
| @radix-ui/react-toggle-group | Toggle group |
| @radix-ui/react-tooltip | Tooltip |

### Diğer
| Paket | Sürüm | Açıklama |
|-------|-------|----------|
| class-variance-authority | ^0.7.1 | Component variant yönetimi |
| clsx | ^2.1.1 | Class name birleştirme |
| cmdk | ^1.1.1 | Command palette (⌘K) |
| date-fns | ^3.6.0 | Tarih formatlama |
| embla-carousel-react | ^8.6.0 | Carousel |
| input-otp | ^1.4.2 | OTP input |
| lucide-react | ^0.462.0 | İkon kütüphanesi |
| next-themes | ^0.3.0 | Tema yönetimi (light/dark) |
| react-day-picker | ^8.10.1 | Tarih seçici |
| react-resizable-panels | ^2.1.9 | Resize edilebilir paneller |
| recharts | ^2.15.4 | Dashboard grafikleri |
| sonner | ^1.7.4 | Toast notifications (alternatif) |
| tailwind-merge | ^2.6.0 | Tailwind class çakışma çözücü |
| vaul | ^0.9.9 | Drawer bileşeni |
| vite-plugin-image-optimizer | ^2.0.3 | Build-time görsel optimizasyonu |

---

## 3. Dizin Yapısı

```
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
│       └── hero-botika.jpg          # LCP hero görseli
│
├── src/
│   ├── main.tsx                     # Uygulama giriş noktası
│   ├── App.tsx                      # Router + providers
│   ├── App.css                      # (boş/minimal)
│   ├── index.css                    # Tasarım token'ları + global stiller
│   ├── vite-env.d.ts
│   │
│   ├── assets/                      # ES6 import ile kullanılan görseller
│   │   ├── hero-botika.jpg
│   │   ├── hero-lifestyle.jpg
│   │   ├── hero-product.png
│   │   ├── hero-slide-1.jpg
│   │   ├── hero-slide-2.jpg
│   │   ├── banner-cases.jpg
│   │   ├── banner-charger.jpg
│   │   ├── banner-power.jpg
│   │   ├── banner-straps.jpg
│   │   ├── category-tv-parca.jpg
│   │   ├── product-*.jpg/png        # 14+ ürün görseli
│   │   └── ...
│   │
│   ├── components/
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Logo.tsx                 # SVG Logo (GE chip ikonu)
│   │   ├── NavLink.tsx
│   │   ├── ProductCard.tsx          # Ürün kartı bileşeni
│   │   ├── ProductDrawer.tsx        # Ürün detay çekmecesi (Sheet)
│   │   ├── ScrollToTop.tsx          # Rota değişiminde scroll reset
│   │   ├── SearchBar.tsx            # Arama çubuğu + autocomplete
│   │   ├── SkeletonPage.tsx         # Suspense fallback
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSection.tsx      # Hero banner (ken-burns, CMS içerik)
│   │   │   ├── BrandMarquee.tsx     # Marka kaydırma bandı
│   │   │   ├── FeaturesSection.tsx  # 4 özellik kartı (CMS içerik)
│   │   │   └── StatsSection.tsx     # İstatistik sayıları
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Sticky header, arama, mobil menü
│   │   │   ├── Footer.tsx           # 4 sütun footer
│   │   │   ├── PublicLayout.tsx     # Header + Outlet + Footer
│   │   │   └── AdminLayout.tsx      # Sidebar + Outlet
│   │   │
│   │   ├── seo/
│   │   │   └── JsonLd.tsx           # Organization, Product, FAQ schema
│   │   │
│   │   └── ui/                      # shadcn/ui bileşenleri (40+ dosya)
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── sheet.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── toast.tsx
│   │       └── ... (30+ daha)
│   │
│   ├── config/
│   │   └── site.ts                  # Sabit site ayarları (isim, WhatsApp, adres)
│   │
│   ├── data/
│   │   ├── brands.ts                # Statik marka listesi (fallback)
│   │   ├── categories.ts            # Statik kategori listesi (fallback)
│   │   ├── products.ts              # Statik ürün listesi (fallback)
│   │   └── shipping-companies.ts    # Kargo şirketleri listesi
│   │
│   ├── hooks/
│   │   ├── useAdminAuth.ts          # Admin oturum doğrulama
│   │   ├── useAuditLog.ts           # İşlem kaydı ekleme
│   │   ├── useBrands.ts             # Marka listesi (Supabase)
│   │   ├── useCategories.ts         # Kategori + ürün sayısı + ilk görsel
│   │   ├── useFeaturedProducts.ts   # Öne çıkan ürünler
│   │   ├── useLazyVisible.ts        # IntersectionObserver lazy yükleme
│   │   ├── usePageContent.ts        # CMS sayfa içerikleri (page_contents)
│   │   ├── usePageMeta.ts           # document.title + meta description
│   │   ├── usePartFinder.ts         # TV model arama + uyumlu parçalar
│   │   ├── useProduct.ts            # Tekil ürün (slug ile)
│   │   ├── useProducts.ts           # Ürün listesi (filtre, arama)
│   │   ├── useRecentProducts.ts     # Son eklenen ürünler
│   │   ├── useRevealOnScroll.ts     # Scroll-triggered reveal animasyonu
│   │   ├── useSearch.ts             # Debounced arama + öneriler
│   │   ├── useSiteSettings.ts       # Site ayarları (DB'den)
│   │   ├── use-mobile.tsx           # Mobil breakpoint hook
│   │   └── use-toast.ts             # Toast hook
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Supabase istemci (otomatik üretilir)
│   │       └── types.ts             # DB tip tanımları (otomatik üretilir)
│   │
│   ├── lib/
│   │   ├── utils.ts                 # cn() — clsx + tailwind-merge
│   │   ├── imageUtils.ts            # Supabase Storage görsel optimizasyonu
│   │   └── escapeIlike.ts           # PostgREST ilike kaçış fonksiyonu
│   │
│   ├── pages/
│   │   ├── Index.tsx                # Ana Sayfa
│   │   ├── Products.tsx             # Ürün Kataloğu
│   │   ├── ProductPage.tsx          # Ürün Detay
│   │   ├── BrandPage.tsx            # Marka Sayfası
│   │   ├── PartFinder.tsx           # AI Parça Bulucu
│   │   ├── CargoTracking.tsx        # Kargo Takip
│   │   ├── Contact.tsx              # İletişim + Form
│   │   ├── About.tsx                # Hakkımızda
│   │   ├── FAQ.tsx                   # SSS
│   │   ├── WarrantyReturn.tsx       # Garanti & İade
│   │   ├── PrivacyKVKK.tsx          # Gizlilik / KVKK
│   │   ├── CookiePolicy.tsx         # Çerez Politikası
│   │   ├── NotFound.tsx             # 404
│   │   │
│   │   └── admin/
│   │       ├── AdminLogin.tsx       # Admin giriş
│   │       ├── Dashboard.tsx        # Dashboard (istatistikler)
│   │       ├── AdminProducts.tsx    # Ürün CRUD
│   │       ├── AdminBrands.tsx      # Marka CRUD
│   │       ├── AdminCategories.tsx  # Kategori CRUD
│   │       ├── AdminMessages.tsx    # İletişim mesajları
│   │       ├── AdminSEO.tsx         # SEO ayarları
│   │       ├── AdminSiteEdit.tsx    # Site ayarları düzenleme
│   │       ├── AdminMedia.tsx       # Medya yönetimi
│   │       ├── AdminUsers.tsx       # Kullanıcı davet/yönetim
│   │       ├── AdminAuditLog.tsx    # İşlem kayıtları
│   │       ├── AdminTVModels.tsx    # TV model yönetimi
│   │       └── AdminPageContents.tsx # CMS sayfa içerikleri
│   │
│   └── types/
│       └── product.ts               # Product tipi + normalizeProduct()
│
├── supabase/
│   ├── config.toml                  # Supabase proje yapılandırması
│   └── functions/
│       ├── part-finder-ai/index.ts  # AI parça bulucu (streaming SSE)
│       ├── process-image/index.ts   # AI arka plan kaldırma
│       ├── invite-user/index.ts     # Kullanıcı davet
│       └── list-users/index.ts      # Kullanıcı listeleme
│
├── index.html                       # SPA giriş HTML
├── tailwind.config.ts               # Tailwind yapılandırması
├── vite.config.ts                   # Vite yapılandırması
├── tsconfig.json                    # TypeScript yapılandırması
├── components.json                  # shadcn/ui yapılandırması
└── .env                             # Ortam değişkenleri
```

---

## 4. Sayfa Envanteri

### 4.1 Public Sayfalar (12)

| # | Sayfa | Rota | Dosya | SEO Meta | Veri Kaynağı | Next.js Önerisi |
|---|-------|------|-------|----------|-------------|-----------------|
| 1 | **Ana Sayfa** | `/` | `Index.tsx` | "Garanti Elektronik \| Orijinal TV Yedek Parça ve Anakart Tedarikçisi" | `brands`, `products` (featured + recent), `categories`, `page_contents` | **ISR** (revalidate: 300s) |
| 2 | **Ürünler** | `/urunler` | `Products.tsx` | "Ürünler \| Garanti Elektronik" | `products` (filtrelenmiş), `brands`, `categories` | **SSR** (search params dinamik) |
| 3 | **Ürün Detay** | `/urun/:slug` | `ProductPage.tsx` | "{Ürün Adı} \| Garanti Elektronik" | `products` (tekil, slug ile) | **ISR** (revalidate: 600s) + `generateStaticParams` |
| 4 | **Marka** | `/marka/:slug` | `BrandPage.tsx` | "{Marka Adı} Ürünleri \| Garanti Elektronik" | `brands`, `products` (marka filtreli) | **ISR** (revalidate: 600s) + `generateStaticParams` |
| 5 | **Kargo Takip** | `/kargo-takip` | `CargoTracking.tsx` | "Kargo Takip \| Garanti Elektronik" | `shipping-companies.ts` (statik) | **SSG** |
| 6 | **Hakkımızda** | `/hakkimizda` | `About.tsx` | "Hakkımızda \| Garanti Elektronik" | `page_contents` | **ISR** (revalidate: 3600s) |
| 7 | **İletişim** | `/iletisim` | `Contact.tsx` | "İletişim \| Garanti Elektronik" | `page_contents`, `contact_messages` (insert) | **SSG** + client action |
| 8 | **SSS** | `/sss` | `FAQ.tsx` | "Sıkça Sorulan Sorular \| Garanti Elektronik" | `page_contents` | **ISR** (revalidate: 3600s) |
| 9 | **Garanti & İade** | `/garanti-iade` | `WarrantyReturn.tsx` | "Garanti ve İade \| Garanti Elektronik" | `page_contents` | **ISR** (revalidate: 3600s) |
| 10 | **Gizlilik / KVKK** | `/gizlilik-kvkk` | `PrivacyKVKK.tsx` | "Gizlilik ve KVKK \| Garanti Elektronik" | `page_contents` | **SSG** |
| 11 | **Çerez Politikası** | `/cerez-politikasi` | `CookiePolicy.tsx` | "Çerez Politikası \| Garanti Elektronik" | `page_contents` | **SSG** |
| 12 | **Parça Bulucu** | `/parca-bulucu` | `PartFinder.tsx` | "TV Parça Bulucu \| Garanti Elektronik" | `tv_models`, `model_product_compatibility`, AI streaming | **SSG** + client interaction |

### 4.2 Admin Sayfalar (12)

| # | Sayfa | Rota | Dosya | Not |
|---|-------|------|-------|-----|
| 1 | **Admin Login** | `/admin` | `AdminLogin.tsx` | E-posta + şifre, `user_roles` ile yetki kontrolü |
| 2 | **Dashboard** | `/admin/dashboard` | `Dashboard.tsx` | İstatistik kartları, recharts grafikleri |
| 3 | **Ürünler** | `/admin/urunler` | `AdminProducts.tsx` | CRUD, görsel yükleme, specs JSON düzenleme |
| 4 | **Markalar** | `/admin/markalar` | `AdminBrands.tsx` | CRUD |
| 5 | **Kategoriler** | `/admin/kategoriler` | `AdminCategories.tsx` | CRUD |
| 6 | **Mesajlar** | `/admin/mesajlar` | `AdminMessages.tsx` | İletişim mesajları, okundu/okunmadı |
| 7 | **SEO** | `/admin/seo` | `AdminSEO.tsx` | Site meta ayarları |
| 8 | **Site Düzenleme** | `/admin/site-duzenle` | `AdminSiteEdit.tsx` | site_settings tablosu düzenleme |
| 9 | **Medya** | `/admin/medya` | `AdminMedia.tsx` | Supabase Storage dosya yönetimi, AI arka plan kaldırma |
| 10 | **Kullanıcılar** | `/admin/kullanicilar` | `AdminUsers.tsx` | Edge function ile kullanıcı davet/listeleme |
| 11 | **İşlem Kaydı** | `/admin/islem-kaydi` | `AdminAuditLog.tsx` | audit_log tablosu görüntüleme |
| 12 | **TV Modelleri** | `/admin/tv-modelleri` | `AdminTVModels.tsx` | TV model CRUD, uyumluluk eşleştirme |
| 13 | **Sayfa İçerikleri** | `/admin/sayfa-icerikleri` | `AdminPageContents.tsx` | CMS sayfa içerik düzenleme |

### 4.3 Özel Rotalar
| Rota | Dosya | Not |
|------|-------|-----|
| `*` (404) | `NotFound.tsx` | Catch-all 404 sayfası |

---

## 5. Veritabanı Şeması

### 5.1 Tablolar

#### `products`
| Sütun | Tip | Nullable | Default | Açıklama |
|-------|-----|----------|---------|----------|
| id | uuid | ✗ | gen_random_uuid() | PK |
| name | text | ✗ | — | Ürün adı |
| slug | text | ✗ | — | URL-friendly slug |
| code | text | ✓ | — | Ürün/parça kodu |
| brand_id | uuid | ✓ | — | FK → brands.id |
| category_id | uuid | ✓ | — | FK → categories.id |
| images | text[] | ✓ | '{}' | Görsel URL dizisi |
| specs | jsonb | ✓ | '{}' | Teknik özellikler (key-value) |
| compatibility | text | ✓ | '' | Uyumluluk bilgisi |
| is_featured | boolean | ✗ | false | Öne çıkan mı? |
| featured_order | integer | ✗ | 0 | Öne çıkan sıralama |
| created_at | timestamptz | ✗ | now() | Oluşturma tarihi |
| updated_at | timestamptz | ✗ | now() | Güncelleme tarihi |

#### `brands`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| name | text | ✗ | — |
| slug | text | ✗ | — |
| description | text | ✓ | '' |
| created_at | timestamptz | ✗ | now() |
| updated_at | timestamptz | ✗ | now() |

#### `categories`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| name | text | ✗ | — |
| slug | text | ✗ | — |
| description | text | ✓ | '' |
| created_at | timestamptz | ✗ | now() |
| updated_at | timestamptz | ✗ | now() |

#### `contact_messages`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| name | text | ✗ | — |
| email | text | ✗ | — |
| message | text | ✗ | — |
| is_read | boolean | ✗ | false |
| created_at | timestamptz | ✗ | now() |

#### `tv_models`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| model_number | text | ✗ | — |
| brand_id | uuid | ✓ | — (FK → brands.id) |
| screen_size | text | ✓ | — |
| year | text | ✓ | — |
| created_at | timestamptz | ✗ | now() |
| updated_at | timestamptz | ✗ | now() |

#### `model_product_compatibility`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| tv_model_id | uuid | ✗ | — (FK → tv_models.id) |
| product_id | uuid | ✗ | — (FK → products.id) |
| notes | text | ✓ | — |
| created_at | timestamptz | ✗ | now() |

#### `site_settings`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| key | text | ✗ | — |
| value | text | ✓ | '' |
| updated_at | timestamptz | ✗ | now() |

#### `page_contents`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| page_key | text | ✗ | — |
| section_key | text | ✗ | — |
| content | jsonb | ✗ | '{}' |
| updated_at | timestamptz | ✗ | now() |

#### `user_roles`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| user_id | uuid | ✗ | — |
| role | app_role (enum) | ✗ | — |

#### `audit_log`
| Sütun | Tip | Nullable | Default |
|-------|-----|----------|---------|
| id | uuid | ✗ | gen_random_uuid() |
| action | text | ✗ | — |
| detail | text | ✓ | '' |
| user_id | uuid | ✓ | — |
| created_at | timestamptz | ✗ | now() |

### 5.2 Enum
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');
```

### 5.3 Veritabanı Fonksiyonları
```sql
-- Rol kontrolü
CREATE FUNCTION has_role(_role app_role, _user_id uuid) RETURNS boolean;

-- Otomatik updated_at güncelleme
CREATE FUNCTION update_updated_at_column() RETURNS trigger;
```

### 5.4 RLS Politikaları Özeti

| Tablo | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| products | ✅ Public | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| brands | ✅ Public | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| categories | ✅ Public | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| contact_messages | 🔒 Admin | ✅ Anyone (validation) | 🔒 Admin | 🔒 Admin |
| tv_models | ✅ Public | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| model_product_compatibility | ✅ Public | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| site_settings | ✅ Public | 🔒 Admin | 🔒 Admin | ❌ Yok |
| page_contents | ✅ Public | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| user_roles | 🔒 Admin + Own | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| audit_log | 🔒 Admin | 🔒 Authenticated (own) | ❌ Yok | ❌ Yok |

**Not:** `contact_messages` INSERT politikasında karakter uzunluğu kontrolü var:
```sql
WITH CHECK (char_length(name) >= 2 AND char_length(email) >= 5 AND char_length(message) >= 10)
```

---

## 6. Edge Functions

### 6.1 `part-finder-ai`
- **Amaç:** AI tabanlı TV arıza teşhisi ve yedek parça önerisi
- **Yöntem:** POST, streaming SSE response
- **Model:** `google/gemini-3-flash-preview` (Lovable AI Gateway)
- **Girdi:** `{ message: string, history: Array<{role, content}> }`
- **Çıktı:** SSE stream (OpenAI uyumlu format)
- **Özellikler:**
  - Tüm ürün kataloğunu system prompt'a ekler
  - Usta/son kullanıcı modu otomatik algılama
  - `:::product{...}:::` formatında inline ürün kartları
  - Rate limit (429) ve kredi limiti (402) hata yönetimi
- **Migration:** Next.js `app/api/part-finder-ai/route.ts` olarak taşınacak (streaming response)

### 6.2 `process-image`
- **Amaç:** AI ile ürün görsellerinden arka plan kaldırma
- **Yöntem:** POST
- **Auth:** Bearer token (admin/editor rolü zorunlu)
- **Model:** `google/gemini-2.5-flash-image`
- **Akış:** Storage'dan indir → base64'e çevir → AI'a gönder → sonucu Storage'a yükle
- **Migration:** Next.js `app/api/process-image/route.ts`

### 6.3 `invite-user`
- **Amaç:** Admin tarafından yeni kullanıcı oluşturma ve rol atama
- **Auth:** Admin rolü zorunlu
- **Girdi:** `{ email, role, password? }`
- **İşlem:** `auth.admin.createUser()` + `user_roles.insert()` + `audit_log.insert()`
- **Migration:** Next.js `app/api/admin/invite-user/route.ts`

### 6.4 `list-users`
- **Amaç:** Tüm kullanıcıları rolleriyle birlikte listeleme
- **Auth:** Admin rolü zorunlu
- **İşlem:** `auth.admin.listUsers()` + `user_roles` join
- **Migration:** Next.js `app/api/admin/list-users/route.ts`

---

## 7. Tasarım Sistemi ve UI/UX

### 7.1 Renk Paleti (CSS Variables — HSL)

#### Light Mode
```css
--background: 0 0% 100%;          /* #FFFFFF — Beyaz */
--foreground: 220 20% 10%;        /* #141821 — Koyu lacivert */
--card: 220 14% 97%;              /* #F5F6F8 — Açık gri */
--primary: 220 20% 10%;           /* Foreground ile aynı */
--accent: 38 92% 50%;             /* #F5A623 — Turuncu (CTA) */
--muted: 220 12% 95%;             /* #F0F1F4 */
--muted-foreground: 220 8% 46%;   /* #6E7383 */
--destructive: 0 84% 60%;         /* #E53E3E — Kırmızı */
--border: 220 12% 90%;            /* #E2E4E9 */
--surface: 220 14% 97%;           /* Card ile aynı */
--accent-orange: 38 92% 50%;      /* Ana CTA rengi */
--whatsapp: 142 72% 42%;          /* #25D366 — WhatsApp yeşili */
```

#### Dark Mode
```css
--background: 220 20% 6%;         /* #0D1017 */
--foreground: 0 0% 96%;           /* #F5F5F5 */
--card: 220 18% 10%;              /* #151A24 */
--accent: 38 92% 50%;             /* Aynı turuncu */
--border: 220 15% 18%;            /* #252B38 */
```

#### Özel Renkler
```css
--accent-orange / --accent-orange-hover  /* CTA butonları */
--whatsapp / --whatsapp-hover            /* WhatsApp butonları */
--surface / --surface-dark               /* Yüzey arka planları */
```

### 7.2 Tipografi
- **Font Ailesi:** Inter (Google Fonts, async yükleme)
- **Font Ağırlıkları:** 400 (normal), 600 (semibold), 700 (bold), 800 (extrabold)
- **Heading:** Inter, line-height: 1.1, letter-spacing: -0.02em
- **Body:** Inter, 16px, line-height: 1.6
- **Mono:** Sistem mono (parça kodları için)
- **Migration:** `next/font/google` ile değiştirilecek

### 7.3 Bileşen Kütüphanesi

#### Özel Bileşenler
| Bileşen | Dosya | Açıklama |
|---------|-------|----------|
| `Logo` | `Logo.tsx` | SVG chip ikonu, GE metni, darkInner prop'u |
| `ProductCard` | `ProductCard.tsx` | Ürün kartı: görsel, marka badge, kod, Detay + WhatsApp butonları |
| `ProductDrawer` | `ProductDrawer.tsx` | Sheet tabanlı ürün detay çekmecesi |
| `SearchBar` | `SearchBar.tsx` | Debounced arama, autocomplete dropdown |
| `HeroSection` | `HeroSection.tsx` | Ken-burns animasyonlu hero, CMS içerik, CTA butonları |
| `BrandMarquee` | `BrandMarquee.tsx` | Sonsuz kaydırma marka bandı (3x tekrar) |
| `FeaturesSection` | `FeaturesSection.tsx` | 4 özellik kartı grid, CMS içerik desteği |
| `StatsSection` | `StatsSection.tsx` | 4 istatistik sayısı, tabular-nums |
| `EmptyState` | `EmptyState.tsx` | Boş sonuç durumu |
| `ErrorBoundary` | `ErrorBoundary.tsx` | React error boundary |
| `SkeletonPage` | `SkeletonPage.tsx` | Lazy loading fallback |

#### shadcn/ui Bileşenleri (40+)
Accordion, AlertDialog, Alert, AspectRatio, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, InputOTP, Input, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toaster, ToggleGroup, Toggle, Tooltip

### 7.4 Animasyonlar

| Animasyon | CSS Sınıfı | Açıklama |
|-----------|-----------|----------|
| **Reveal on Scroll** | `.reveal-on-scroll` | IntersectionObserver ile, translateY(24px) → 0, opacity 0 → 1 |
| **Card Hover Lift** | `.card-hover-lift` | translateY(-6px) + shadow artışı, mobilde devre dışı |
| **Marquee** | `.marquee-track` | 30s linear infinite translateX, hover'da pause |
| **Ken Burns** | `.hero-ken-burns` | 25s scale(1) → scale(1.08), mobilde devre dışı |
| **Fade In** | `animate-fade-in` | 0.4s translateY(8px) → 0 |
| **Accordion** | `animate-accordion-down/up` | Radix accordion geçişi |
| **Category Hover** | `.category-banner-img` | 0.7s scale(1.08) |
| **Hero Product Hover** | `.hero-product-image` | 0.7s scale(1.05) |

**Erişilebilirlik:** `prefers-reduced-motion: reduce` medya sorgusu ile tüm animasyonlar devre dışı bırakılır.

### 7.5 Responsive Breakpoint'ler
```
sm: 640px   — Mobil → Tablet
md: 768px   — Tablet
lg: 1024px  — Desktop
xl: 1280px  — Geniş ekran
2xl: 1400px — Container max-width
```

### 7.6 Performans Optimizasyonları
- **CSS Containment:** `section { contain: layout style; }`
- **Mobil GPU:** Ken-burns, grain overlay, glass card efektleri mobilde devre dışı
- **Lazy Loading:** `useLazyVisible` hook ile below-fold section'lar lazy render
- **Image Optimization:** `optimizeImageUrl()` ile Supabase Storage width/resize parametreleri
- **Font Loading:** `media="print" onload="this.media='all'"` ile async yükleme
- **Code Splitting:** React.lazy + Suspense ile sayfa ve bileşen lazy loading

### 7.7 Erişilebilirlik Özellikleri
- Skip-to-content link ("İçeriğe Geç")
- Semantik HTML: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`, `<address>`
- ARIA: `aria-label`, `aria-hidden`, `aria-expanded`, `aria-controls`, `role="dialog"`, `role="alert"`, `role="button"`, `role="contentinfo"`
- Focus ring: `focus:outline-none focus:ring-2 focus:ring-*`
- Tüm `<img>` etiketlerinde `alt` ve boyut (`width`, `height`) tanımlı
- Keyboard navigation: `tabIndex`, `onKeyDown` (Enter)

---

## 8. SEO Yapısı

### 8.1 Mevcut Meta Tag Yönetimi
- **Hook:** `usePageMeta({ title, description })` — `document.title` ve meta description'ı client-side günceller
- **Sorun:** SPA olduğu için ilk yükleme anında index.html'deki sabit meta'lar gelir; crawlerlar dinamik meta'ları göremez
- **Migration:** `generateMetadata()` async fonksiyonu ile server-side meta üretimi

### 8.2 JSON-LD Şemaları
```tsx
// OrganizationJsonLd — Ana sayfada
{
  "@type": "Organization",
  "name": "Garanti Elektronik",
  "url": "https://garantielektronik.com",
  "contactPoint": { telephone, contactType: "customer service", availableLanguage: "Turkish" },
  "address": { streetAddress, addressLocality, postalCode, addressCountry: "TR" }
}

// ProductJsonLd — Ürün detay sayfasında
{
  "@type": "Product",
  "name", "description", "image", "sku", "brand",
  "offers": { "@type": "Offer", availability: "InStock", priceCurrency: "TRY", price: "0" }
}

// FAQPageJsonLd — SSS sayfasında
{
  "@type": "FAQPage",
  "mainEntity": [{ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }]
}
```

### 8.3 Dosyalar
- **sitemap.xml:** `public/sitemap.xml` (statik)
- **robots.txt:** Googlebot, Bingbot, Twitterbot, facebookexternalhit → Allow: /
- **Canonical:** `<link rel="canonical" href="https://garantielektronik.com" />`
- **Open Graph:** og:type, og:title, og:description, og:image
- **Twitter Card:** summary_large_image

### 8.4 Migration SEO Stratejisi
```tsx
// Next.js — app/(public)/urun/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} | Garanti Elektronik`,
    description: product.compatibility,
    openGraph: { images: [product.images[0]] },
  };
}
```

---

## 9. Özel Hook'lar ve Yardımcı Fonksiyonlar

### 9.1 Hook'lar

| Hook | Dosya | Amaç | Supabase Tablosu | Next.js Dönüşümü |
|------|-------|------|-----------------|-----------------|
| `useProducts` | useProducts.ts | Filtrelenmiş ürün listesi | products, brands, categories | Server Component + `searchParams` |
| `useProduct` | useProduct.ts | Tekil ürün (slug) | products | `getProduct()` server fonksiyonu |
| `useFeaturedProducts` | useFeaturedProducts.ts | Öne çıkan ürünler (limit 4) | products | Server Component data fetch |
| `useRecentProducts` | useRecentProducts.ts | Son eklenen ürünler (limit 4) | products | Server Component data fetch |
| `useBrands` | useBrands.ts | Tüm markalar | brands | Server Component / ISR |
| `useCategories` | useCategories.ts | Kategoriler + ürün sayısı + ilk görsel | categories, products | Server Component |
| `useSearch` | useSearch.ts | Debounced arama + öneriler | products | Client Component (interaktif) |
| `useProduct` (search) | useProduct.ts | Drawer için ürün | products | Client Component |
| `usePartFinder` | usePartFinder.ts | TV model arama + uyumlu parçalar | tv_models, model_product_compatibility | Client Component |
| `useAdminAuth` | useAdminAuth.ts | Admin oturum doğrulama | user_roles | Middleware + server auth |
| `useAuditLog` | useAuditLog.ts | İşlem kaydı ekleme | audit_log | Server Action |
| `useSiteSettings` | useSiteSettings.ts | Site ayarları (cache'li) | site_settings | Server Component / ISR |
| `usePageContent` | usePageContent.ts | CMS sayfa içerikleri | page_contents | Server Component / ISR |
| `usePageMeta` | usePageMeta.ts | Client-side meta güncelleme | — | `generateMetadata()` |
| `useRevealOnScroll` | useRevealOnScroll.ts | Scroll-triggered reveal | — | Client Component (aynen taşınır) |
| `useLazyVisible` | useLazyVisible.ts | IntersectionObserver lazy render | — | Kaldırılabilir (Next.js SSR ile gereksiz) |
| `useMobile` | use-mobile.tsx | Mobil breakpoint algılama | — | Client Component |

### 9.2 Yardımcı Fonksiyonlar

| Fonksiyon | Dosya | Amaç |
|-----------|-------|------|
| `cn()` | lib/utils.ts | clsx + tailwind-merge |
| `optimizeImageUrl()` | lib/imageUtils.ts | Supabase Storage URL'ine width/resize parametresi ekler |
| `escapeIlike()` | lib/escapeIlike.ts | PostgREST ilike sorguları için % ve _ kaçışı |
| `normalizeProduct()` | types/product.ts | ProductRow → Product dönüşümü (images, specs, brand, category) |
| `parseAIContent()` | pages/PartFinder.tsx | AI cevabındaki `:::product{...}:::` kalıplarını parse eder |

---

## 10. Migration Checklist

### 10.1 Next.js App Router Geçiş Stratejisi

#### Rendering Stratejileri
| Strateji | Sayfalar | Neden |
|----------|----------|-------|
| **SSG** | Kargo Takip, İletişim, Gizlilik, Çerez Politikası | Statik içerik, DB bağımlılığı yok |
| **ISR** (revalidate: 300s) | Ana Sayfa | Öne çıkan ürünler + istatistikler sık değişmez |
| **ISR** (revalidate: 600s) | Ürün Detay, Marka, Hakkımızda, SSS, Garanti/İade | DB içerik CMS'den yönetilir |
| **SSR** | Ürünler (searchParams bağımlı) | Dinamik filtre/arama |
| **Client** | Parça Bulucu, Admin sayfaları | Interaktif AI chat, CRUD |

#### `generateStaticParams` Kullanılacak Sayfalar
```tsx
// Ürün detay: /urun/[slug]
export async function generateStaticParams() {
  const products = await supabase.from("products").select("slug");
  return products.data?.map((p) => ({ slug: p.slug })) ?? [];
}

// Marka: /marka/[slug]
export async function generateStaticParams() {
  const brands = await supabase.from("brands").select("slug");
  return brands.data?.map((b) => ({ slug: b.slug })) ?? [];
}
```

### 10.2 Supabase Entegrasyonu

#### Server-Side Client
```tsx
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (cookiesToSet) => { /* ... */ } } }
  );
}
```

#### Client-Side Client
```tsx
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### Middleware (Auth)
```tsx
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Admin rotaları için oturum kontrolü
  if (request.nextUrl.pathname.startsWith("/admin/")) {
    // Session & role check, redirect to /admin if unauthorized
  }
}

export const config = { matcher: ["/admin/:path((?!$).*)"] };
```

### 10.3 Tailwind CSS ve shadcn/ui Geçişi
- ✅ `tailwind.config.ts` → Aynen taşınır (content paths güncellenir)
- ✅ `index.css` (CSS variables) → `app/globals.css` olarak taşınır
- ✅ shadcn/ui bileşenleri → `components/ui/` klasörü aynen taşınır
- ✅ `components.json` → shadcn CLI için güncellenir
- ✅ `cn()` utility → `lib/utils.ts` aynen taşınır

### 10.4 Edge Functions → Next.js API Routes

| Mevcut Edge Function | Next.js API Route | Not |
|---------------------|-------------------|-----|
| `part-finder-ai` | `app/api/part-finder-ai/route.ts` | Streaming response (`ReadableStream`) |
| `process-image` | `app/api/process-image/route.ts` | Supabase service role key server-side |
| `invite-user` | `app/api/admin/invite-user/route.ts` | Admin auth middleware |
| `list-users` | `app/api/admin/list-users/route.ts` | Admin auth middleware |

#### Streaming SSE Örneği (part-finder-ai)
```tsx
// app/api/part-finder-ai/route.ts
export async function POST(request: Request) {
  const { message, history } = await request.json();
  
  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages, stream: true }),
  });

  return new Response(aiResponse.body, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

### 10.5 SEO İyileştirmeleri
- `usePageMeta` → `generateMetadata()` (her sayfa için)
- `index.html` meta'ları → `app/layout.tsx` metadata export
- `OrganizationJsonLd` → `app/(public)/layout.tsx` içinde
- `ProductJsonLd` → `app/(public)/urun/[slug]/page.tsx` içinde
- Dinamik sitemap: `app/sitemap.ts` ile DB'den otomatik üretim
- Dinamik robots: `app/robots.ts`

### 10.6 Görsel Optimizasyonu
```tsx
// Mevcut: <img src={optimizeImageUrl(url, 400)} loading="lazy" />
// Hedef:
import Image from "next/image";
<Image
  src={product.images[0]}
  alt={product.name}
  width={400}
  height={300}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-contain"
/>
```

**Supabase Storage loader:**
```tsx
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/**" },
    ],
  },
};
```

### 10.7 Ortam Değişkenleri Eşleştirmesi

| Vite (.env) | Next.js (.env.local) |
|-------------|---------------------|
| `VITE_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| — | `SUPABASE_SERVICE_ROLE_KEY` (server-only) |
| — | `LOVABLE_API_KEY` (server-only, API routes için) |

### 10.8 WhatsApp ve Harici Servis Entegrasyonları
- **WhatsApp:** `siteConfig.social.whatsappUrl()` → Aynen taşınır (client-side link)
- **Google Maps:** `<iframe>` embed → Aynen taşınır (lazy loading)
- **AI Gateway:** `ai.gateway.lovable.dev` → API route'lardan çağrılır (server-side)
- **Kargo Takip:** Kargo şirketi linklerine yönlendirme (statik)

### 10.9 Dikkat Edilecek Kritik Noktalar

1. **`use client` Direktifi:** InterActive bileşenler (SearchBar, ProductDrawer, PartFinder chat, admin formları) `"use client"` olarak işaretlenmeli
2. **Router Geçişi:** `react-router-dom` → `next/navigation` (`useRouter`, `useParams`, `useSearchParams`, `Link`)
3. **Dynamic Routes:** `/urun/:slug` → `/urun/[slug]`, `/marka/:slug` → `/marka/[slug]`
4. **ScrollToTop:** Next.js App Router otomatik scroll reset yapar; `ScrollToTop.tsx` kaldırılabilir
5. **ErrorBoundary:** `error.tsx` dosyaları ile değiştirilir
6. **Loading States:** `loading.tsx` dosyaları ile Suspense otomatik
7. **Font Loading:** `next/font/google` ile Inter yükleme
8. **CSS Import:** Vite'deki `import "./App.css"` kalkacak, `app/globals.css` kullanılacak
9. **Supabase Types:** `supabase gen types typescript` CLI ile tip dosyası yeniden üretilecek
10. **Admin Auth:** Middleware ile koruma, server component'larda session kontrolü

---

## 11. Önerilen Next.js Dizin Yapısı

```
├── app/
│   ├── layout.tsx                   # Root layout (font, providers, metadata)
│   ├── globals.css                  # index.css içeriği
│   ├── not-found.tsx                # 404 sayfası
│   ├── error.tsx                    # Global error boundary
│   ├── loading.tsx                  # Global loading state
│   ├── sitemap.ts                   # Dinamik sitemap
│   ├── robots.ts                    # Dinamik robots.txt
│   │
│   ├── (public)/                    # Public route group
│   │   ├── layout.tsx               # Header + Footer layout
│   │   ├── page.tsx                 # Ana Sayfa (ISR)
│   │   │
│   │   ├── urunler/
│   │   │   └── page.tsx             # Ürün kataloğu (SSR)
│   │   │
│   │   ├── urun/
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Ürün detay (ISR + generateStaticParams)
│   │   │
│   │   ├── marka/
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Marka sayfası (ISR + generateStaticParams)
│   │   │
│   │   ├── kargo-takip/
│   │   │   └── page.tsx             # Kargo takip (SSG)
│   │   │
│   │   ├── hakkimizda/
│   │   │   └── page.tsx             # Hakkımızda (ISR)
│   │   │
│   │   ├── iletisim/
│   │   │   └── page.tsx             # İletişim (SSG + client action)
│   │   │
│   │   ├── sss/
│   │   │   └── page.tsx             # SSS (ISR)
│   │   │
│   │   ├── garanti-iade/
│   │   │   └── page.tsx             # Garanti & İade (ISR)
│   │   │
│   │   ├── gizlilik-kvkk/
│   │   │   └── page.tsx             # KVKK (SSG)
│   │   │
│   │   ├── cerez-politikasi/
│   │   │   └── page.tsx             # Çerez Politikası (SSG)
│   │   │
│   │   └── parca-bulucu/
│   │       └── page.tsx             # Parça Bulucu (SSG + client)
│   │
│   ├── admin/
│   │   ├── page.tsx                 # Admin Login
│   │   ├── layout.tsx               # Admin sidebar layout
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── urunler/
│   │   │   └── page.tsx
│   │   ├── markalar/
│   │   │   └── page.tsx
│   │   ├── kategoriler/
│   │   │   └── page.tsx
│   │   ├── mesajlar/
│   │   │   └── page.tsx
│   │   ├── seo/
│   │   │   └── page.tsx
│   │   ├── site-duzenle/
│   │   │   └── page.tsx
│   │   ├── medya/
│   │   │   └── page.tsx
│   │   ├── kullanicilar/
│   │   │   └── page.tsx
│   │   ├── islem-kaydi/
│   │   │   └── page.tsx
│   │   ├── tv-modelleri/
│   │   │   └── page.tsx
│   │   └── sayfa-icerikleri/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── part-finder-ai/
│       │   └── route.ts             # AI streaming SSE
│       ├── process-image/
│       │   └── route.ts             # AI arka plan kaldırma
│       └── admin/
│           ├── invite-user/
│           │   └── route.ts
│           └── list-users/
│               └── route.ts
│
├── components/
│   ├── home/
│   │   ├── HeroSection.tsx          # "use client" (animasyon)
│   │   ├── BrandMarquee.tsx         # "use client" (animasyon)
│   │   ├── FeaturesSection.tsx
│   │   └── StatsSection.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx               # "use client" (scroll, sheet)
│   │   ├── Footer.tsx               # Server component olabilir
│   │   └── AdminSidebar.tsx         # "use client"
│   │
│   ├── product/
│   │   ├── ProductCard.tsx          # "use client" (onClick)
│   │   ├── ProductDrawer.tsx        # "use client" (Sheet)
│   │   └── ProductGrid.tsx          # Server component
│   │
│   ├── search/
│   │   └── SearchBar.tsx            # "use client"
│   │
│   ├── seo/
│   │   └── JsonLd.tsx               # Server component
│   │
│   └── ui/                          # shadcn/ui (aynen taşınır)
│       └── ... (40+ dosya)
│
├── lib/
│   ├── utils.ts                     # cn()
│   ├── imageUtils.ts
│   ├── escapeIlike.ts
│   └── supabase/
│       ├── server.ts                # createServerClient
│       ├── client.ts                # createBrowserClient
│       └── middleware.ts            # Auth helper
│
├── hooks/
│   ├── useSearch.ts                 # Client-side arama (aynen)
│   ├── usePartFinder.ts             # Client-side model arama (aynen)
│   ├── useRevealOnScroll.ts         # Client-side animasyon (aynen)
│   ├── useAuditLog.ts               # → Server Action'a dönüşebilir
│   └── use-mobile.tsx               # Client-side (aynen)
│
├── config/
│   └── site.ts                      # Sabit site config (aynen)
│
├── types/
│   └── product.ts                   # Product tipi + normalizeProduct (aynen)
│
├── middleware.ts                     # Admin auth + Supabase session refresh
├── next.config.ts                   # Next.js config (images, redirects)
├── tailwind.config.ts               # Tailwind config (content paths güncelle)
├── tsconfig.json
├── components.json                  # shadcn/ui config
└── .env.local                       # Ortam değişkenleri
```

---

## Ek: Migration Sırası (Önerilen)

### Faz 1: Temel Altyapı
1. Next.js projesi oluştur (`npx create-next-app@latest`)
2. Tailwind CSS + shadcn/ui kur
3. `globals.css` (CSS variables) taşı
4. `tailwind.config.ts` güncelle
5. `lib/utils.ts`, `config/site.ts`, `types/product.ts` taşı
6. Supabase client kurulumu (`@supabase/ssr`)
7. Middleware oluştur (auth + session refresh)

### Faz 2: Layout ve Ortak Bileşenler
8. Root layout (font, providers, metadata)
9. Public layout (Header + Footer)
10. Admin layout (Sidebar)
11. shadcn/ui bileşenlerini taşı
12. Logo, ProductCard, SearchBar taşı

### Faz 3: Public Sayfalar
13. Ana sayfa (ISR)
14. Ürünler (SSR)
15. Ürün detay (ISR + generateStaticParams)
16. Marka sayfası (ISR + generateStaticParams)
17. Statik sayfalar (Hakkımızda, SSS, İletişim, vb.)
18. Parça Bulucu (AI chat)

### Faz 4: Admin Sayfaları
19. Admin Login
20. Dashboard
21. CRUD sayfaları (Ürünler, Markalar, Kategoriler, vb.)

### Faz 5: API Routes ve Backend
22. part-finder-ai (streaming)
23. process-image
24. invite-user, list-users
25. Server Actions (iletişim formu, audit log, vb.)

### Faz 6: SEO ve Optimizasyon
26. `generateMetadata` tüm sayfalara
27. Dinamik sitemap.ts
28. robots.ts
29. JSON-LD şemaları
30. `next/image` ile görsel optimizasyonu
31. Lighthouse / Core Web Vitals test

### Faz 7: Deploy ve DNS
32. Vercel'e deploy
33. Cloudflare DNS yapılandırması
34. Domain bağlama
35. E-posta servisi entegrasyonu (Resend/SendGrid)
36. Analytics (GA4/Plausible)
37. Son testler ve go-live

---

> **Bu rapor, Claude Code veya başka bir AI aracına verildiğinde projenin 1:1 yeniden oluşturulabilmesi için gereken tüm bilgiyi içermektedir.**
