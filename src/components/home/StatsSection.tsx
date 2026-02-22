"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageContent } from "@/hooks/usePageContent";

const defaultStats = {
  stats: [
    { value: "500+", label: "Ürün Çeşidi" },
    { value: "10K+", label: "Mutlu Müşteri" },
    { value: "8+", label: "Marka" },
    { value: "%100", label: "Orijinal Garanti" },
  ],
};

const StatsSection = () => {
  const sectionRef = useRevealOnScroll<HTMLElement>();
  const { content } = usePageContent("home_stats", defaultStats);
  const stats = content.stats as { value: string; label: string }[];

  return (
    <section ref={sectionRef} className="bg-background border-t border-b border-border/40">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`reveal-on-scroll delay-${i + 1} text-center relative ${
                i < stats.length - 1 ? 'md:border-r md:border-border/50' : ''
              }`}
            >
              <p className="text-4xl sm:text-5xl md:text-[3.5rem] font-black text-foreground tracking-[-0.03em] stat-number mb-3">
                {stat.value}
              </p>
              <p className="text-[12px] text-muted-foreground/80 font-medium uppercase tracking-[0.14em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
