export interface CategorySEO {
    title: string;
    description: string;
    keywords: string;
}

export const CATEGORY_SEO: Record<string, CategorySEO> = {
    "anakart-mainboard": {
        title: "TV Anakart (Mainboard)",
        description:
            "TV anakart ve mainboard yedek parça. Samsung, LG, Vestel, Arçelik ve tüm markalar için orijinal TV anakartları.",
        keywords: "tv anakart, tv mainboard, tv ana kart",
    },
    "besleme-powerboard": {
        title: "TV Power Board (Besleme Kartı)",
        description:
            "TV power board ve besleme kartı yedek parça. Tüm markalar için orijinal besleme kartları.",
        keywords: "tv power board, tv besleme kartı",
    },
    "inverter-board": {
        title: "TV Inverter Board",
        description:
            "TV inverter board yedek parça. Samsung, LG, Vestel ve tüm markalar için inverter kartları.",
        keywords: "tv inverter board, tv inverter kartı",
    },
    "led-driver": {
        title: "TV LED Driver",
        description:
            "TV LED driver yedek parça. LED bar sürücü kartları, tüm markalar için orijinal ve muadil LED driver.",
        keywords: "tv led driver, led bar sürücü, tv led sürücü kartı",
    },
    tcon: {
        title: "TV T-CON Board",
        description:
            "TV T-Con board yedek parça. Timing controller kartları, Samsung, LG, Vestel ve tüm markalar için T-Con board.",
        keywords: "tv tcon board, tv t-con, timing controller",
    },
    "uzaktan-kumanda": {
        title: "TV Uzaktan Kumanda",
        description:
            "Orijinal ve muadil TV uzaktan kumanda. Samsung, LG, Vestel, Arçelik ve tüm markalar için TV kumandaları.",
        keywords: "tv uzaktan kumanda, tv kumanda, televizyon kumandası",
    },
};

/**
 * Get SEO config for a category by slug.
 * Falls back to a generic config if the slug is not in the map.
 */
export function getCategorySEO(slug: string, categoryName?: string): CategorySEO {
    return (
        CATEGORY_SEO[slug] ?? {
            title: categoryName ?? slug,
            description: `${categoryName ?? slug} kategorisinde TV yedek parça. Tüm markalar için orijinal parçalar.`,
            keywords: `tv ${slug}, tv yedek parça`,
        }
    );
}
