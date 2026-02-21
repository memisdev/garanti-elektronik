import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageContent } from "@/hooks/usePageContent";
import { MapPin, Phone, Mail, Clock, ArrowRight, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/usePageMeta";

const contactSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır."),
  kvkk: z.literal(true, { errorMap: () => ({ message: "KVKK onayı zorunludur." }) }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const defaults = {
  hero_subtitle: "Sorularınız, teknik destek talepleriniz veya sipariş bilgisi için bize ulaşın. En kısa sürede dönüş yapacağız.",
};

const Contact = () => {
  usePageMeta({ title: "İletişim | Garanti Elektronik", description: "Garanti Elektronik ile iletişime geçin. Adres, telefon, e-posta ve WhatsApp bilgileri." });
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  const kvkkChecked = watch("kvkk");
  const infoRef = useRevealOnScroll<HTMLElement>();
  const formRef = useRevealOnScroll<HTMLDivElement>();
  const mapRef = useRevealOnScroll<HTMLDivElement>();
  const { content } = usePageContent("contact", defaults);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      message: data.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Gönderilemedi", description: "Lütfen tekrar deneyin.", variant: "destructive" });
      return;
    }
    toast({ title: "Mesajınız gönderildi!", description: "En kısa sürede size dönüş yapacağız." });
    reset();
  };

  const contactCards = [
    { icon: MapPin, title: "Adres", content: siteConfig.contact.address, link: siteConfig.contact.mapsUrl, linkText: "Haritada Aç →" },
    { icon: Phone, title: "Telefon", content: siteConfig.contact.phone, link: siteConfig.contact.phoneHref },
    { icon: Mail, title: "E-posta", content: siteConfig.contact.email, link: `mailto:${siteConfig.contact.email}` },
    { icon: Clock, title: "Çalışma Saatleri", content: siteConfig.contact.workingHours },
  ];

  return (
    <div>
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="accent-bar" />
              <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">İletişim</span>
            </div>
            <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
              <span className="font-light text-primary-foreground/60">Bizimle</span>
              <br />
              <span className="font-black text-primary-foreground">iletişime geçin</span>
            </h1>
            <p className="text-sm text-primary-foreground/50 mt-4 max-w-md leading-relaxed">
              {content.hero_subtitle}
            </p>
          </div>
        </div>
      </section>

      <section ref={infoRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {contactCards.map((card, i) => (
              <div key={card.title} className={`reveal-on-scroll delay-${i + 1} bg-card rounded-2xl p-6 border border-border card-hover-lift`}>
                <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center mb-4">
                  <card.icon className="w-4.5 h-4.5 text-primary-foreground" aria-hidden="true" />
                </div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-2">{card.title}</p>
                {card.link ? (
                  <a href={card.link} target={card.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
                    {card.content}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-foreground">{card.content}</p>
                )}
                {card.linkText && (
                  <a href={card.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-accent hover:text-accent/80 font-medium mt-2 inline-block transition-colors">
                    {card.linkText}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div ref={formRef}>
              <div className="reveal-on-scroll">
                <div className="accent-bar mb-4" />
                <h2 className="text-xl font-black text-foreground tracking-tight mb-8">Mesaj Gönderin</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="reveal-on-scroll delay-1 bg-card rounded-2xl border border-border p-8 space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Ad Soyad</label>
                  <input id="name" {...register("name")}
                    className="w-full h-12 text-sm px-4 border-0 rounded-xl bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200"
                    placeholder="Adınız Soyadınız" />
                  {errors.name && <p className="text-xs text-destructive mt-1.5" role="alert">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">E-posta</label>
                  <input id="email" type="email" {...register("email")}
                    className="w-full h-12 text-sm px-4 border-0 rounded-xl bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200"
                    placeholder="ornek@email.com" />
                  {errors.email && <p className="text-xs text-destructive mt-1.5" role="alert">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Mesaj</label>
                  <textarea id="message" rows={4} {...register("message")}
                    className="w-full text-sm p-4 border-0 rounded-xl bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none transition-all duration-200"
                    placeholder="Mesajınızı yazın..." />
                  {errors.message && <p className="text-xs text-destructive mt-1.5" role="alert">{errors.message.message}</p>}
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="kvkk" checked={kvkkChecked === true}
                    onCheckedChange={(checked) => setValue("kvkk", checked === true ? true : false as any)} className="mt-0.5" />
                  <label htmlFor="kvkk" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    Kişisel verilerimin işlenmesine ilişkin <a href="/gizlilik-kvkk" className="text-foreground hover:underline font-medium">KVKK Aydınlatma Metni</a>'ni okudum ve kabul ediyorum.
                  </label>
                </div>
                {errors.kvkk && <p className="text-xs text-destructive" role="alert">{errors.kvkk.message}</p>}
                <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 bg-foreground hover:bg-primary-hover text-primary-foreground font-semibold h-12 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-foreground/30 disabled:opacity-70">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" aria-hidden="true" />}
                  {submitting ? "Gönderiliyor..." : "Gönder"}
                </button>
              </form>
            </div>

            <div ref={mapRef}>
              <div className="reveal-on-scroll">
                <h2 className="text-xl font-black text-foreground tracking-tight mb-8">Konumumuz</h2>
              </div>
              <div className="reveal-on-scroll delay-1 rounded-2xl overflow-hidden border border-border aspect-[4/3] lg:aspect-auto lg:h-[calc(100%-3.5rem)]">
                <iframe title="Garanti Elektronik Konum"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.5!2d28.7735!3d41.0025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTWVobWV0IEFraWYsIEvEsWzEsccgQWxpIFNrLiBObzozMiwgMzQwMDAgS8O8w6fDvGvDp2VrbWVjZS_EsHN0YW5idWw!5e0!3m2!1str!2str!4v1700000000000"
                  width="100%" height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
