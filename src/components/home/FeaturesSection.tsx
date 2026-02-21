import { Shield, Truck, Headphones, CheckCircle } from "lucide-react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageContent } from "@/hooks/usePageContent";

const icons = [Shield, Truck, Headphones, CheckCircle];

const defaultFeatures = [
  "Orijinal Parçalar|Tüm ürünler orijinal üretici garantili ve sertifikalıdır",
  "Aynı Gün Kargo|15:00'a kadar verilen siparişler aynı gün kargoya verilir",
  "Teknik Destek|Uzman ekibimizden birebir teknik danışmanlık hizmeti",
  "Güvenli Alışveriş|Güvenli ödeme altyapısı ve koşulsuz iade garantisi",
];

const defaults = {
  section_label: "Neden Biz?",
  section_title: "Profesyonel hizmet anlayışı",
  features: defaultFeatures,
};

const FeaturesSection = () => {
  const sectionRef = useRevealOnScroll<HTMLElement>();
  const { content } = usePageContent("home_features", defaults);

  const featureItems = (content.features as string[]).map((f, i) => {
    const [title, desc] = typeof f === "string" ? f.split("|") : [f, ""];
    return { icon: icons[i % icons.length], title: title || "", desc: desc || "" };
  });

  return (
    <section ref={sectionRef} className="bg-foreground grain-overlay relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="section-label text-primary-foreground/60">{content.section_label}</span>
          <h2 className="text-2xl md:text-3xl font-black text-primary-foreground tracking-tight mt-3">
            {content.section_title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureItems.map((feature, i) => (
            <div
              key={i}
              className={`reveal-on-scroll delay-${i + 1} group p-7 rounded-2xl border border-primary-foreground/[0.06] bg-primary-foreground/[0.03] hover:bg-primary-foreground/[0.06] transition-all duration-500`}
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-6 group-hover:bg-accent/25 transition-colors duration-500">
                <feature.icon className="w-5 h-5 text-accent" aria-hidden="true" />
              </div>
              <h3 className="text-[15px] font-bold text-primary-foreground mb-2">{feature.title}</h3>
              <p className="text-[13px] text-primary-foreground/60 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
