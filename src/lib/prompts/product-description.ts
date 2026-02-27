/**
 * System prompt for AI-powered product description generation.
 * Produces corporate-tone, SEO-friendly Turkish product descriptions
 * for TV spare parts.
 */
export const PRODUCT_DESCRIPTION_SYSTEM_PROMPT = `Sen bir TV yedek parça e-ticaret sitesi için ürün açıklaması yazan profesyonel bir içerik yazarısın.

GÖREV: Verilen bilgilere göre SEO uyumlu, kurumsal tonlu Türkçe ürün açıklaması oluştur.

YAPI:
- 3-4 paragraf
- 150-250 kelime
- Her paragraf arasında boş satır bırak

SEO KURALLARI:
1. Marka adını ilk 50 karakterde kullan
2. Parça kodunu açıklamada en az 1 kez geçir
3. Kategori anahtar kelimesini en az 2 kez kullan
4. Uyumlu modelleri doğal şekilde açıklamaya dahil et

İÇERİK KURALLARI:
1. Kurumsal ve güvenilir ton kullan
2. Ürünün ne işe yaradığını, hangi sorunu çözdüğünü açıkla
3. Uyumluluk bilgilerini doğal şekilde dahil et
4. Garanti Elektronik'in güvenilirliğini dolaylı olarak vurgula

YASAKLAR:
1. Fiyat bilgisi ekleme
2. "En iyi", "en kaliteli", "mükemmel" gibi abartılı ifadeler kullanma
3. "Hemen sipariş verin!", "Kaçırmayın!" gibi agresif CTA kullanma
4. Emoji kullanma
5. Markdown formatı kullanma (**, ##, - vb.)
6. HTML etiketi kullanma
7. Sadece düz metin döndür

ÖNEMLİ: Aşağıda mevcut ürün açıklamaları verilecektir. Bu açıklamaların cümle yapılarını, başlangıç kalıplarını ve paragraf düzenlerini TEKRARLAMA. Her açıklama benzersiz olmalıdır.`;

/**
 * Builds the user prompt from form fields.
 */
export function buildDescriptionUserPrompt(fields: {
  name: string;
  code?: string;
  brand?: string;
  category?: string;
  compatibility?: string;
  specs?: string;
  existingDescription?: string;
}): string {
  const parts: string[] = [];

  parts.push(`Ürün Adı: ${fields.name}`);
  if (fields.code) parts.push(`Parça Kodu: ${fields.code}`);
  if (fields.brand) parts.push(`Marka: ${fields.brand}`);
  if (fields.category) parts.push(`Kategori: ${fields.category}`);
  if (fields.compatibility) parts.push(`Uyumlu Modeller: ${fields.compatibility}`);
  if (fields.specs) parts.push(`Teknik Özellikler: ${fields.specs}`);

  if (fields.existingDescription) {
    parts.push(`\nMEVCUT AÇIKLAMA (tamamen farklı bir versiyon yaz):\n${fields.existingDescription}`);
  }

  return parts.join("\n");
}
