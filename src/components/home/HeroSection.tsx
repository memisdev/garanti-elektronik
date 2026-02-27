"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageContent } from "@/hooks/usePageContent";

const defaults = {
  title_light: "Orijinal TV parçaları,",
  title_bold: "güvenilir tedarikçiniz.",
  subtitle: "Samsung, LG, Vestel ve daha fazlası için orijinal yedek parça ve anakart tedariği.\nProfesyonel teknik servisler için güvenilir çözüm ortağı.",
};

interface HeroSectionProps {
  initialContent?: Record<string, unknown>;
}

const HeroSection = ({ initialContent }: HeroSectionProps) => {
  const sectionRef = useRevealOnScroll<HTMLElement>();
  const { content } = usePageContent("home_hero", defaults, { initialData: initialContent });

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] bg-foreground overflow-hidden grain-overlay">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-botika.webp"
          alt="TV elektronik yedek parça ve anakart ürünleri"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCAAGAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIE/8QAHhAAAgIBBQEAAAAAAAAAAAAAAQIAA0EEERITIXL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A36lLWIKW8VPjDbEjpXD2gfcRA//Z"
          className="object-cover hero-ken-burns opacity-25 object-right"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-foreground/30 to-transparent z-[2]" />

      <div className="relative z-10 container mx-auto px-6 h-full min-h-[90vh] flex items-center">
        <div className="max-w-2xl pt-32 pb-24 md:pt-40 md:pb-32">
          <h1 className="reveal-on-scroll text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] tracking-[-0.04em] leading-[1.02] mb-8">
            <span className="font-extralight text-primary-foreground/60">{content.title_light}</span>
            <br />
            <span className="font-black text-primary-foreground">{content.title_bold}</span>
          </h1>

          <p className="reveal-on-scroll delay-1 text-[15px] md:text-[17px] text-primary-foreground/70 max-w-lg mb-10 leading-[1.7] whitespace-pre-line">
            {content.subtitle}
          </p>

          <div className="reveal-on-scroll delay-2 flex flex-row gap-3 items-center">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 sm:px-9 py-3 sm:py-4 rounded-lg hover:opacity-90 transition-all text-[13px] sm:text-[14px] tracking-wide focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-foreground">
              Ürünleri İncele
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 border border-primary-foreground/25 text-primary-foreground/80 hover:text-primary-foreground hover:border-primary-foreground/40 font-semibold px-6 sm:px-9 py-3 sm:py-4 rounded-lg transition-all text-[13px] sm:text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 focus:ring-offset-2 focus:ring-offset-foreground">
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-foreground to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
