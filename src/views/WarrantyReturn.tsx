"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePageContent } from "@/hooks/usePageContent";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react";

const icons = [Shield, RotateCcw, AlertTriangle, CheckCircle];

const defaultSections = [
  { title: "Garanti Koşulları", items: [
    "Orijinal ürünlerde 6 ay, muadil ürünlerde 3 ay garanti süresi uygulanır.",
    "Garanti süresi, ürünün kargo ile teslim edildiği tarihten itibaren başlar.",
    "Garanti kapsamında arızalı ürünler ücretsiz olarak değiştirilir.",
    "Garanti belgesi ve fatura muhafaza edilmelidir.",
  ]},
  { title: "İade Koşulları", items: [
    "Ürün teslim tarihinden itibaren 14 gün içinde iade talebi oluşturulabilir.",
    "İade edilecek ürün kullanılmamış, orijinal ambalajında ve hasarsız olmalıdır.",
    "İade kargo ücreti alıcıya aittir, hatalı/arızalı gönderimlerde kargo tarafımızca karşılanır.",
    "İade tutarı, ürünün tarafımıza ulaşmasından itibaren 3 iş günü içinde iade edilir.",
  ]},
  { title: "Garanti Dışı Durumlar", items: [
    "Kullanıcı hatası veya yanlış montajdan kaynaklanan arızalar.",
    "Fiziksel darbe, su teması veya elektrik dalgalanmasından kaynaklanan hasarlar.",
    "Yetkisiz müdahale görmüş ürünler.",
    "Garanti süresi dolmuş ürünler.",
  ]},
  { title: "Değişim Süreci", items: [
    "WhatsApp veya İletişim formu üzerinden iade/değişim talebinizi iletin.",
    "Ürün fotoğrafı ve fatura bilgisi paylaşın.",
    "Onay sonrası ürünü belirtilen adrese kargolayın.",
    "Yeni ürün, iade ürünün tarafımıza ulaşmasından sonra 1-2 iş günü içinde gönderilir.",
  ]},
];

const defaults = {
  hero_subtitle: "Müşteri memnuniyeti odaklı garanti ve iade politikamız hakkında detaylı bilgi.",
  sections: defaultSections,
};

const WarrantyReturn = () => {
  usePageMeta({ title: "Garanti ve İade Koşulları | Garanti Elektronik", description: "Orijinal parçalarda 6 ay, muadil parçalarda 3 ay garanti. 14 gün içinde iade imkânı." });
  const contentRef = useRevealOnScroll<HTMLDivElement>();
  const { content } = usePageContent("warranty", defaults);
  const sections = content.sections as { title: string; items: string[] }[];

  return (
    <div>
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-5">
            <div className="accent-bar" />
            <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">Politikalar</span>
          </div>
          <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
            <span className="font-light text-primary-foreground/50">Garanti ve</span>
            <br />
            <span className="font-black text-primary-foreground">İade Koşulları</span>
          </h1>
          <p className="text-sm text-primary-foreground/50 mt-4 max-w-md leading-relaxed">
            {content.hero_subtitle}
          </p>
        </div>
      </section>

      <section ref={contentRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-3xl">
          <div className="space-y-8">
            {sections.map((section, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className={`reveal-on-scroll delay-${Math.min(i + 1, 4)} bg-card rounded-2xl border border-border p-8`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="reveal-on-scroll mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">Sorularınız mı var?</p>
            <Link to="/iletisim"
              className="inline-flex items-center gap-2 bg-foreground text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all text-sm">
              Bize Ulaşın
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WarrantyReturn;
