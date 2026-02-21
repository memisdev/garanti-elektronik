import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePageContent } from "@/hooks/usePageContent";
import { Building2, Users, Award, Wrench } from "lucide-react";

const defaults = {
  hero_subtitle: "2010'dan beri Türkiye'nin dört bir yanındaki teknik servislere güvenilir TV yedek parça tedariki sağlıyoruz.",
  intro: "Garanti Elektronik, TV yedek parça ve anakart sektöründe uzun yıllara dayanan tecrübesiyle hizmet vermektedir. Samsung, LG, Vestel, Philips, Arçelik, Sony ve Toshiba başta olmak üzere tüm büyük markaların orijinal ve muadil parçalarını tedarik etmekteyiz.\n\nMüşterilerimizin %90'ından fazlası profesyonel teknik servislerdir. Bu bize sektörün ihtiyaçlarını yakından tanıma ve stok planlamasını buna göre yapma avantajı sağlamaktadır.",
  mission: "Müşterilerimize en kaliteli elektronik yedek parçaları, uygun fiyatlarla ve hızlı teslimatla sunmak. Teknik destek ve uyumluluk danışmanlığı ile doğru parçayı bulmanızı sağlamak.",
  milestones: [
    { year: "2010", event: "İstanbul'da küçük bir atölye olarak faaliyete başladık." },
    { year: "2014", event: "Samsung ve LG yetkili parça distribütörü olduk." },
    { year: "2018", event: "Online satış kanalımızı açarak Türkiye geneline hizmet vermeye başladık." },
    { year: "2022", event: "500+ ürün portföyü ve 5.000+ teknik servis müşterisine ulaştık." },
  ],
  team: [
    { role: "Satış ve Müşteri İlişkileri", count: "4 kişi", desc: "Sipariş, fiyat ve uyumluluk sorularınıza hızlı dönüş" },
    { role: "Teknik Destek", count: "3 kişi", desc: "Parça eşleştirme ve montaj danışmanlığı" },
    { role: "Depo ve Lojistik", count: "3 kişi", desc: "Aynı gün kargo ve güvenli paketleme" },
  ],
  values: [
    "Müşteri memnuniyeti odaklı çalışma",
    "Orijinal ve kaliteli ürün garantisi",
    "Hızlı ve güvenilir kargo",
    "Teknik destek ve danışmanlık",
  ],
};

const About = () => {
  usePageMeta({ title: "Hakkımızda | Garanti Elektronik", description: "2010'dan beri TV yedek parça tedarikinde güvenilir isim. Samsung, LG, Vestel ve daha fazlası." });
  const contentRef = useRevealOnScroll();
  const timelineRef = useRevealOnScroll();
  const teamRef = useRevealOnScroll();
  const { content } = usePageContent("about", defaults);

  const milestones = content.milestones as { year: string; event: string }[];
  const team = content.team as { role: string; count: string; desc: string }[];
  const values = content.values as string[];
  const introParas = (content.intro as string).split("\n\n");

  return (
    <div>
      {/* Hero Band */}
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-5">
            <div className="accent-bar" />
            <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">Hakkımızda</span>
          </div>
          <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
            <span className="font-light text-primary-foreground/60">Biz kimiz,</span>
            <br />
            <span className="font-black text-primary-foreground">ne yapıyoruz?</span>
          </h1>
          <p className="text-sm text-primary-foreground/50 mt-4 max-w-md leading-relaxed">
            {content.hero_subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-3xl">
          <div className="reveal-on-scroll text-muted-foreground space-y-5 leading-relaxed">
            {introParas.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {/* Stats row */}
          <div className="reveal-on-scroll delay-1 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { icon: Building2, value: "14+", label: "Yıllık Tecrübe" },
              { icon: Users, value: "5.000+", label: "Teknik Servis Müşterisi" },
              { icon: Award, value: "500+", label: "Ürün Çeşidi" },
              { icon: Wrench, value: "7+", label: "Desteklenen Marka" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl p-5 border border-border text-center">
                <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" aria-hidden="true" />
                <p className="text-xl font-black text-foreground">{stat.value}</p>
                <p className="text-[12px] text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="reveal-on-scroll delay-2 mt-16">
            <div className="accent-bar mb-4" />
            <h2 className="text-xl font-black text-foreground tracking-tight mb-4">Misyonumuz</h2>
            <p className="text-muted-foreground leading-relaxed">{content.mission}</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="bg-background">
        <div className="container mx-auto px-6 pb-16 md:pb-24 max-w-3xl">
          <div className="reveal-on-scroll">
            <h2 className="text-xl font-black text-foreground tracking-tight mb-8">Tarihçemiz</h2>
          </div>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div key={i} className={`reveal-on-scroll delay-${Math.min(i + 1, 4)} flex gap-6 items-start`}>
                <span className="text-lg font-black text-accent shrink-0 w-14">{m.year}</span>
                <div className="flex-1 bg-card rounded-2xl p-5 border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="bg-background">
        <div className="container mx-auto px-6 pb-16 md:pb-24 max-w-3xl">
          <div className="reveal-on-scroll">
            <h2 className="text-xl font-black text-foreground tracking-tight mb-8">Ekibimiz</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {team.map((t, i) => (
              <div key={i} className={`reveal-on-scroll delay-${i + 1} bg-card rounded-2xl p-6 border border-border card-hover-lift`}>
                <p className="text-sm font-bold text-foreground mb-1">{t.role}</p>
                <p className="text-[11px] font-semibold text-accent mb-3">{t.count}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background">
        <div className="container mx-auto px-6 pb-16 md:pb-24 max-w-3xl">
          <div className="reveal-on-scroll">
            <h2 className="text-xl font-black text-foreground tracking-tight mb-8">Değerlerimiz</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((value, i) => (
              <div key={i} className={`reveal-on-scroll delay-${i + 1} bg-card rounded-2xl p-6 border border-border card-hover-lift`}>
                <div className="w-1.5 h-1.5 rounded-full bg-accent mb-3" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
