export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  { id: "1", slug: "tv-parca", name: "TV Parça", description: "Power board, T-Con board, inverter ve diğer TV yedek parçaları." },
  { id: "2", slug: "anakart", name: "Anakart", description: "TV ana kartları (main board) tüm markalar için." },
];
