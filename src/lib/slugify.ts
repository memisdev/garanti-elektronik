/**
 * Converts Turkish text to a URL-safe slug.
 * Handles Turkish characters: ğ, ü, ş, ı, ö, ç
 */
export function slugify(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
