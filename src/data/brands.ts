export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export const brands: Brand[] = [
  { id: "1", slug: "samsung", name: "Samsung", description: "Samsung TV yedek parça ve anakartları." },
  { id: "2", slug: "lg", name: "LG", description: "LG TV yedek parça ve anakartları." },
  { id: "3", slug: "vestel", name: "Vestel", description: "Vestel TV yedek parça ve anakartları." },
  { id: "4", slug: "philips", name: "Philips", description: "Philips TV yedek parça ve anakartları." },
  { id: "5", slug: "arcelik", name: "Arçelik", description: "Arçelik TV yedek parça ve anakartları." },
  { id: "6", slug: "sony", name: "Sony", description: "Sony TV yedek parça ve anakartları." },
  { id: "7", slug: "toshiba", name: "Toshiba", description: "Toshiba TV yedek parça ve anakartları." },
  { id: "8", slug: "panasonic", name: "Panasonic", description: "Panasonic TV yedek parça ve anakartları." },
];
