

# Garanti Asistan - Master Prompt Guncellemesi

## Ozet
Mevcut sistem prompt'u tamamen yeniden yazilacak. Kullanicinin verdigi kapsamli "Lovable Master Prompt" sablonu bire bir uygulanacak. Usta-odakli iki modlu (Usta / Son Kullanici) calisma, yapilandirilmis cikti formati, izolasyon test menusu ve guclendirilmis guvenlik kurallari eklenecek.

## Yapilacak Degisiklikler

### 1. Edge Function System Prompt Guncelleme
**Dosya:** `supabase/functions/part-finder-ai/index.ts`

Mevcut `systemPrompt` degiskeni tamamen yeni icerikle degistirilecek:

- **Kimlik + Guvenlik**: Mevcut kimlik gizliligi, kapsam siniri, prompt injection korumalari korunacak
- **Iki Modlu Calisma**: Usta modu (varsayilan) ve son kullanici modu otomatik algilama
- **Usta Modu Cikti Formati**: 
  1. Durum ozeti
  2. 3 olasi kok neden (artiran/azaltan bulgular + olasilik araligi)
  3. 3 izolasyon testi (hizli-ucuz-kesin sirasina gore)
  4. Kosullu parca karari + REV/board code dogrulama
  5. Eksik veri listesi
- **Son Kullanici Modu**: Basitlestirilmis cikti, guvenli testler, tehlikeli adimlarin cikarilmasi
- **Domain Heuristics**: flash_then_black, fener testi, yari ekran, isi/basinc etkisi, standby blink gibi semptom siniflandirmalari
- **Izolasyon Test Menusu**: STBY5V, PS-ON, BL-ON, 12V/24V rail, LED+/-, T-Con 12V, konnektor/FFC, seri lamba - 8 standart test
- **Parca Onerisi Politikasi**: Board code / model code dogrulanmadan kesin parca kodu verilmez, REV uyarisi zorunlu
- **Onboarding**: Usta icin 6 veri isteme (model code, panel code, PSU board code, main board code, semptom sinifi, olcum degerleri)
- **Guvenlik**: Usta tarafinda bile yuksek riskli adimlarda izolasyon trafosu/seri lamba/ESD uyarisi; son kullaniciya tehlikeli adim ASLA verilmez

### 2. Frontend Uyumlu Degisiklikler
**Dosya:** `src/pages/PartFinder.tsx`

- Ornek sorular usta diline uygun olarak guncellenecek (ornegin: "Samsung UE55NU7100 flash_then_black", "LG 49UK6300 STBY5V yok")
- Placeholder metin usta diline uyarlanacak

## Teknik Detaylar

- Model `google/gemini-3-flash-preview` olarak kalacak
- Urun katalogu dinamik olarak veritabanindan cekilmeye devam edecek
- `:::product{...}:::` formati korunacak, frontend parsing degismeyecek
- Streaming yaklasimi ayni kalacak
- WhatsApp numarasi `+90 546 512 50 35` olarak kalacak
- Mevcut hata yonetimi (429/402/500) korunacak
