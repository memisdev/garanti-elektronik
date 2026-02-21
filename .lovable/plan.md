

# Sayfa Icerikleri Admin Panelden Duzenlenebilir Olsun

## Ozet
Tum sayfalardaki metin icerikleri (basliklar, paragraflar, SSS maddeleri, ozellikler vb.) admin panelden duzenlenebilir hale getirilecek. Mevcut `site_settings` tablosu key-value yapisina uygun olarak kullanilacak.

## Kapsam
Duzenlenecek sayfalar ve icerikleri:

| Sayfa | Duzenlenecek Icerikler |
|-------|----------------------|
| Ana Sayfa (Hero) | Baslik, alt baslik |
| Ana Sayfa (CTA) | Baslik, alt yazi |
| Ana Sayfa (Ozellikler) | Bolum basligi, 4 ozellik baslik+aciklama |
| Hakkimizda | Hero metni, tanitim paragraflari, misyon, tarihce maddeleri, ekip bilgileri, degerler |
| Iletisim | Hero metni, alt yazi |
| SSS | Hero metni, SSS soru-cevap listesi |
| Garanti ve Iade | Hero metni, bolum icerikleri |
| Gizlilik KVKK | Tum icerik bolumu |
| Cerez Politikasi | Tum icerik bolumu |

## Teknik Yaklasim

### 1. Veritabani - `page_contents` Tablosu
Mevcut `site_settings` yerine ayri bir `page_contents` tablosu olusturulacak. Cunku sayfa icerikleri JSON formatinda karmasik yapilar icerebilir (SSS listesi, tarihce dizisi vb.).

```sql
CREATE TABLE page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,        -- 'home_hero', 'about', 'faq', 'contact' vb.
  section_key text NOT NULL,     -- 'hero_title', 'faq_items', 'milestones' vb.
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(page_key, section_key)
);
```

RLS politikalari:
- Herkes okuyabilir (public SELECT)
- Sadece adminler yazabilir (INSERT/UPDATE)

### 2. Icerik Hook'u - `usePageContent`
Sayfa icerikleri icin bir React hook olusturulacak. Varsayilan degerleri (simdiki hardcoded metinler) fallback olarak kullanacak. Veritabaninda deger varsa onu gosterecek.

### 3. Admin Sayfasi - "Sayfa Icerikleri"
`/admin/sayfa-icerikleri` rotasina yeni bir admin sayfasi eklenecek. Sol tarafta sayfa listesi (tab), sag tarafta secili sayfanin duzenlenebilir alanlari olacak.

Her sayfa icin:
- Basit metinler: text input veya textarea
- Listeler (SSS, tarihce, degerler): Dinamik olarak madde ekle/sil/duzenle

### 4. Sayfa Bilesenlerinin Guncellenmesi
Her sayfa bileseni, hardcoded metinler yerine `usePageContent` hook'undan gelen degerleri kullanacak. Hook, veritabanindan veri gelene kadar mevcut varsayilan degerleri gosterecek (flash yok).

### Uygulama Adimlari

1. `page_contents` tablosunu olustur (migration)
2. `usePageContent` hook'unu yaz
3. `AdminPageContents.tsx` admin sayfasini olustur
4. Admin layout ve router'a yeni sayfayi ekle
5. Tum sayfa bilesenlerini hook'u kullanacak sekilde guncelle (About, Contact, FAQ, Index/HeroSection, FeaturesSection, WarrantyReturn, PrivacyKVKK, CookiePolicy)

### Avantajlar
- Mevcut metinler varsayilan olarak kalir, veritabaninda veri yoksa hicbir sey bozulmaz
- Admin hicbir sey degistirmezse site aynen calisir
- Tek bir hook ile tum sayfalarda tutarli yapi
