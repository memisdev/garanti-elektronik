

# Garanti Asistan Erisilebilirlik ve Scroll Duzeltmesi

## Sorunlar

1. **Yazi alani sabit boyutlu**: Tek satirlik `Input` kullaniliyor. Uzun metinlerde kullanici yazdigi seyi goremez.
2. **Sayfa scroll sorunu**: AI cevap verdikce `scrollIntoView` fonksiyonu tum sayfayi yukari-asagi oynatir. Bunun nedeni `chatEndRef.current?.scrollIntoView()` cagrisinin sayfa genelinde scroll tetiklemesi.

## Cozum

### 1. Otomatik Buyuyen Textarea
- Tek satirlik `Input` yerine `textarea` kullanilacak.
- Kullanici yazdikca yukseklik otomatik artacak (max 5-6 satira kadar).
- Enter ile gonderme, Shift+Enter ile yeni satir davranisi korunacak.

### 2. Scroll Duzeltmesi
- `scrollIntoView` yerine, sadece chat mesaj kutusunun (`.h-[400px]` olan div) kendi icerisinde en alta scroll yapilacak.
- Chat container'a bir `ref` eklenecek ve `container.scrollTop = container.scrollHeight` kullanilacak.
- Boylece sayfa asla yukari-asagi oynamaz, sadece sohbet kutusu icinde en son mesaja kayar.

## Teknik Detaylar

**Dosya**: `src/pages/PartFinder.tsx`

Degisiklikler:
- Yeni bir `chatContainerRef` eklenecek (chat mesaj alanina ref olarak).
- `useEffect` icindeki `chatEndRef.current?.scrollIntoView(...)` yerine `chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight` kullanilacak.
- Input alani `textarea` ile degistirilecek. `onInput` event'inde `scrollHeight`'a gore yukseklik ayarlanacak. Minimum 1 satir, maksimum ~120px.
- `chatEndRef` div'i kaldirilacak (artik gerekli degil).

