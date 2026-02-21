import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showCTA?: boolean;
}

const EmptyState = ({
  title = "Sonuç bulunamadı",
  description = "Arama kriterlerinize uygun ürün bulunamadı. Filtreleri değiştirerek tekrar deneyebilirsiniz.",
  showCTA = true,
}: EmptyStateProps) => (
  <div className="text-center py-24 md:py-32">
    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
      <SearchX className="w-7 h-7 text-muted-foreground/60" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
      {description}
    </p>
    {showCTA && (
      <Link
        to="/urunler"
        className="inline-flex items-center bg-foreground text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all text-sm"
      >
        Tüm Ürünleri Gör
      </Link>
    )}
  </div>
);

export default EmptyState;
