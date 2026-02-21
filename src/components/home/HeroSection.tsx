import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageContent } from "@/hooks/usePageContent";

const defaults = {
  title_light: "Orijinal TV parçaları,",
  title_bold: "güvenilir tedarikçiniz.",
  subtitle: "Samsung, LG, Vestel ve daha fazlası için orijinal yedek parça ve anakart tedariki.\nProfesyonel teknik servisler için güvenilir çözüm ortağı.",
};

const HeroSection = () => {
  const sectionRef = useRevealOnScroll<HTMLElement>();
  const { content } = usePageContent("home_hero", defaults);

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] bg-foreground overflow-hidden grain-overlay">
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/images/hero-botika.jpg" type="image/webp" />
          <img
            src="/images/hero-botika.jpg"
            alt="TV elektronik yedek parça ve anakart ürünleri"
            className="w-full h-full object-cover hero-ken-burns opacity-25 object-right"
            width={1920}
            height={1080}
            sizes="100vw"
            decoding="async"
            fetchPriority="high" />
        </picture>

        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full min-h-[90vh] flex items-center">
        <div className="max-w-2xl py-24 md:py-32">
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
              to="/urunler"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 sm:px-9 py-3 sm:py-4 rounded-lg hover:opacity-90 transition-all text-[13px] sm:text-[14px] tracking-wide focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-foreground">
              Ürünleri İncele
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/iletisim"
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
