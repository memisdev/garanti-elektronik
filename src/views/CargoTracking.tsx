"use client";

import { useState } from "react";
import { shippingCompanies } from "@/data/shipping-companies";
import { ExternalLink, Package, Truck, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const CargoTracking = () => {
  const [companyId, setCompanyId] = useState("");
  const [code, setCode] = useState("");
  const contentRef = useRevealOnScroll<HTMLElement>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !code.trim()) {
      toast({ title: "Lütfen kargo firması ve takip kodunu girin.", variant: "destructive" });
      return;
    }
    const company = shippingCompanies.find((c) => c.id === companyId);
    if (!company) return;
    const url = company.trackingUrl.replace("{code}", encodeURIComponent(code.trim()));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const steps = [
    { icon: Package, title: "Kargo Firması Seçin", description: "Gönderinizin ait olduğu kargo firmasını listeden seçin." },
    { icon: Truck, title: "Takip Kodunu Girin", description: "Faturanızda veya SMS'te yer alan takip numaranızı girin." },
    { icon: MapPin, title: "Gönderinizi Takip Edin", description: "Kargo firmasının sitesinde anlık durumu görüntüleyin." },
  ];

  return (
    <div>
      {/* Hero Band */}
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 pt-[152px] pb-20 md:pt-[184px] md:pb-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="accent-bar" />
              <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">Kargo</span>
            </div>
            <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
              <span className="font-light text-primary-foreground/50">Kargo</span>{" "}
              <span className="font-black text-primary-foreground">takip</span>
            </h1>
            <p className="text-sm text-primary-foreground/60 mt-4 max-w-md leading-relaxed">
              Siparişinizin güncel durumunu anında öğrenin. Takip kodunuzu girerek kargo firmasının sitesine yönlendirilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Steps + Form */}
      <section ref={contentRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={`reveal-on-scroll delay-${i + 1} bg-card rounded-2xl p-6 border border-border card-hover-lift`}
              >
                <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center mb-4">
                  <step.icon className="w-4.5 h-4.5 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm font-bold text-foreground">{step.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-lg mx-auto">
            <div className="reveal-on-scroll">
              <div className="accent-bar mb-4" />
              <h2 className="text-xl font-black text-foreground tracking-tight mb-8">Gönderi Sorgula</h2>
            </div>

            <div className="reveal-on-scroll delay-1 bg-card rounded-2xl p-8 md:p-10 border border-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="company" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Kargo Firması</label>
                  <select id="company" value={companyId} onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full h-12 text-sm px-4 border-0 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200">
                    <option value="">Seçiniz</option>
                    {shippingCompanies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="code" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Takip Kodu</label>
                  <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)}
                    placeholder="Takip kodunuzu girin"
                    className="w-full h-12 text-sm px-4 border-0 rounded-xl bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200" />
                </div>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-foreground hover:bg-primary-hover text-primary-foreground font-semibold h-12 rounded-full transition-all duration-200">
                  <ExternalLink className="w-4 h-4" />
                  Kargo Takip Et
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CargoTracking;
