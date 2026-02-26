import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import type { Product } from "@/types/product";
import { siteConfig } from "@/config/site";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const whatsappMessage = siteConfig.whatsapp.defaultMessage(
    product.name,
    product.code ?? undefined
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
      {/* Image */}
      <div className="aspect-square bg-card rounded-2xl relative overflow-hidden border border-border/40">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain mix-blend-multiply p-12"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            Görsel yok
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {/* Status badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Test Edilmiş - Çalışır Durumda
          </span>
        </div>

        {/* Compatibility box */}
        {product.compatibility && (
          <div className="bg-card rounded-2xl px-6 py-4 mb-6 border border-border/40">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Uyumluluk:</span>{" "}
              {product.compatibility}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={siteConfig.social.whatsappUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 flex-1 bg-whatsapp hover:bg-whatsapp-hover text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-whatsapp/50"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            WhatsApp&apos;tan Sor
          </a>
          <a
            href={siteConfig.contact.phoneHref}
            className="inline-flex items-center justify-center gap-2 flex-1 bg-foreground hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            Hemen Ara
          </a>
        </div>
      </div>
    </div>
  );
}
