
# Garanti Elektronik - Next.js Migration Raporu

Bu belgeyi `.md` dosyasi olarak projeye kaydedecegim. Asagida raporun tam icerigi yer almaktadir.

---

## Yapilacak Is

`MIGRATION_REPORT.md` adinda tek bir dosya olusturulacak. Dosya asagidaki tum bolum ve detaylari icerecek:

### Raporun Icerigi

**1. Proje Kimlik Karti**
- Site adi, amaci, hedef kitlesi, URL, dil, teknoloji yigini

**2. Mevcut Teknoloji Yigini**
- React 18 + Vite + TypeScript + Tailwind CSS + Supabase
- Tum npm bagimliliklari listesi
- UI kit: shadcn/ui (Radix UI tabanli)

**3. Dizin Yapisi (Tam Agac)**
- src/ altindaki tum klasor ve dosyalar
- supabase/functions altindaki edge function'lar
- public/ altindaki statik dosyalar

**4. Sayfa Envanteri (Public + Admin)**
- Her sayfa icin: rota, dosya yolu, SEO meta bilgisi, veri kaynagi, SSR/SSG onerisi
- Public: 12 sayfa (Ana Sayfa, Urunler, Urun Detay, Marka, Kargo Takip, Hakkimizda, Iletisim, SSS, Garanti/Iade, KVKK, Cerez, Parca Bulucu)
- Admin: 12 sayfa (Login, Dashboard, Urunler, Markalar, Kategoriler, Mesajlar, SEO, Site Duzenleme, Medya, Kullanicilar, Islem Kaydi, TV Modelleri, Sayfa Icerikleri)

**5. Veritabani Semasi**
- 8 tablo: products, brands, categories, contact_messages, tv_models, model_product_compatibility, site_settings, page_contents, user_roles, audit_log
- RLS politikalari ozeti
- Enum: app_role
- DB fonksiyonlari: has_role, update_updated_at_column

**6. Edge Functions (Backend)**
- part-finder-ai: AI tabanli TV parca bulucu (streaming SSE)
- process-image: AI ile arka plan kaldirma
- invite-user: Kullanici davet
- list-users: Kullanici listeleme

**7. Tasarim Sistemi ve UI/UX**
- Renk paleti (CSS variables, light/dark)
- Tipografi: Inter font ailesi
- Bilesenler: ProductCard, ProductDrawer, HeroSection, BrandMarquee, FeaturesSection, StatsSection
- Animasyonlar: reveal-on-scroll, card-hover-lift, marquee, ken-burns
- Responsive breakpoint'ler
- Erisilebilirlik ozellikleri

**8. SEO Yapisi**
- JSON-LD: Organization, Product, FAQPage
- Meta tag yonetimi (usePageMeta hook)
- sitemap.xml, robots.txt
- Open Graph ve Twitter Card meta'lari

**9. Ozel Hook'lar ve Yardimci Fonksiyonlar**
- 17 custom hook'un amac ve kullanimlari
- imageUtils, escapeIlike gibi yardimci fonksiyonlar

**10. Migration Checklist ve Dikkat Edilecekler**
- Next.js App Router'a gecis stratejisi (hangi sayfalar SSG, SSR, ISR)
- Supabase entegrasyonunun korunmasi
- Tailwind CSS ve shadcn/ui gecisi
- Edge function'larin Next.js API Route'lara donusumu
- SEO iyilestirmeleri (next/head, generateMetadata)
- Resim optimizasyonu (next/image)
- Ortam degiskenleri eslestirmesi
- WhatsApp ve harici servis entegrasyonlari

**11. Onerilen Next.js Dizin Yapisi**
- app/ klasor yapisi onerisi
- Route gruplari: (public), (admin)
- components/, lib/, hooks/ organizasyonu

---

## Teknik Detay

- Tek dosya: `MIGRATION_REPORT.md`
- Icerik: Yukaridaki 11 bolumun tamami, kod ornekleri, tablolar ve listelerle
- Dil: Turkce
- Tum mevcut sayfa icerikleri, bilesenler, hook'lar, veritabani tablosu detaylari, RLS politikalari, edge function'lar, tasarim tokenlari ve migration onerileri dahil
