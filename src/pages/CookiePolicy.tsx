import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePageContent } from "@/hooks/usePageContent";

const defaults = {
  intro: "Web sitemizde kullanıcı deneyimini iyileştirmek ve hizmetlerimizi geliştirmek amacıyla çerezler kullanılmaktadır.",
  what_is: "Çerezler, web sitelerinin tarayıcınıza gönderdiği küçük metin dosyalarıdır. Siteyi ziyaretiniz sırasında tercihlerinizi hatırlamak ve site kullanımını analiz etmek amacıyla kullanılır.",
  types: "Zorunlu Çerezler: Sitenin temel işlevleri için gereklidir.\nAnalitik Çerezler: Site kullanım istatistiklerini toplamak için kullanılır.",
  manage: "Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilir veya silebilirsiniz. Ancak bu durumda sitenin bazı özellikleri düzgün çalışmayabilir.",
};

const CookiePolicy = () => {
  usePageMeta({ title: "Çerez Politikası | Garanti Elektronik", description: "Web sitemizde kullanılan çerezler ve yönetim seçenekleri hakkında bilgi." });
  const contentRef = useRevealOnScroll();
  const { content } = usePageContent("cookie", defaults);

  return (
    <div>
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-5">
            <div className="accent-bar" />
            <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">Yasal</span>
          </div>
          <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
            <span className="font-light text-primary-foreground/50">Çerez</span>{" "}
            <span className="font-black text-primary-foreground">Politikası</span>
          </h1>
        </div>
      </section>

      <section ref={contentRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-2xl">
          <div className="reveal-on-scroll text-sm text-muted-foreground space-y-5 leading-relaxed">
            <p>{content.intro}</p>
          </div>

          <div className="reveal-on-scroll delay-1 mt-14">
            <h2 className="text-foreground font-bold text-lg mb-4">Çerez Nedir?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{content.what_is}</p>
          </div>

          <div className="reveal-on-scroll delay-2 mt-14">
            <h2 className="text-foreground font-bold text-lg mb-4">Kullandığımız Çerezler</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{content.types}</p>
          </div>

          <div className="reveal-on-scroll delay-3 mt-14">
            <h2 className="text-foreground font-bold text-lg mb-4">Çerezleri Yönetme</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{content.manage}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
