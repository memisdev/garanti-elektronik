"use client";

import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

interface MobileStickyBarProps {
  productName: string;
  productCode?: string;
}

export default function MobileStickyBar({
  productName,
  productCode,
}: MobileStickyBarProps) {
  const whatsappMessage = siteConfig.whatsapp.defaultMessage(
    productName,
    productCode
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t border-border safe-area-pb">
      <div className="flex gap-2 p-3">
        <a
          href={siteConfig.social.whatsappUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 flex-1 text-[13px] font-bold text-primary-foreground bg-whatsapp hover:bg-whatsapp-hover py-3 rounded-xl transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href={siteConfig.contact.phoneHref}
          className="flex items-center justify-center gap-1.5 flex-1 text-[13px] font-bold text-primary-foreground bg-foreground hover:bg-primary-hover py-3 rounded-xl transition-all duration-200"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          Ara
        </a>
      </div>
    </div>
  );
}
