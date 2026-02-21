import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FAQPageJsonLd } from "@/components/seo/JsonLd";

const faqs = [
  {
    q: "Ürünleriniz orijinal mi?",
    a: "Evet, tüm ürünlerimiz orijinal üretici sertifikalı ve garantili parçalardır. Muadil ürünlerimiz de kalite testlerinden geçirilmektedir.",
  },
  {
    q: "Nasıl sipariş verebilirim?",
    a: "Ürün detay sayfasındaki WhatsApp butonuna tıklayarak veya İletişim sayfamız üzerinden bize ulaşabilirsiniz. Sipariş ve ödeme detaylarını sizinle paylaşacağız.",
  },
  {
    q: "Kargo süresi ne kadar?",
    a: "Saat 15:00'a kadar verilen siparişler aynı gün kargoya teslim edilir. Kargo süresi bulunduğunuz bölgeye göre 1-3 iş günü arasında değişmektedir.",
  },
  {
    q: "Hangi kargo firmaları ile çalışıyorsunuz?",
    a: "Yurtiçi Kargo, Aras Kargo, MNG Kargo, PTT Kargo ve Sürat Kargo ile çalışmaktayız. Tercih ettiğiniz kargo firmasını belirtebilirsiniz.",
  },
  {
    q: "İade ve değişim koşullarınız nelerdir?",
    a: "Ürün teslim tarihinden itibaren 14 gün içinde iade veya değişim yapılabilir. Detaylar için Garanti ve İade Koşulları sayfamızı inceleyebilirsiniz.",
  },
  {
    q: "Parçanın TV modelime uyumlu olup olmadığını nasıl anlarım?",
    a: "Her ürün detay sayfasında uyumluluk bilgisi yer almaktadır. Emin olamadığınız durumlarda WhatsApp üzerinden TV modelinizi ve arızanızı bildirmeniz yeterlidir, teknik ekibimiz size yardımcı olacaktır.",
  },
  {
    q: "Toptan satış yapıyor musunuz?",
    a: "Evet, teknik servisler ve bayiler için toptan satış imkânı sunuyoruz. Detaylı fiyat bilgisi ve anlaşma koşulları için bizimle iletişime geçin.",
  },
  {
    q: "Garanti kapsamı nedir?",
    a: "Tüm orijinal ürünlerimiz 6 ay, muadil ürünlerimiz 3 ay garanti kapsamındadır. Garanti süresi boyunca ücretsiz değişim yapılmaktadır.",
  },
];

const FAQ = () => {
  usePageMeta({ title: "Sıkça Sorulan Sorular | Garanti Elektronik", description: "TV yedek parça siparişi, kargo, iade ve garanti hakkında sıkça sorulan sorular ve yanıtları." });
  const heroRef = useRevealOnScroll<HTMLElement>();
  const contentRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <div>
      <FAQPageJsonLd faqs={faqs} />
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-5">
            <div className="accent-bar" />
            <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">Destek</span>
          </div>
          <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
            <span className="font-light text-primary-foreground/50">Sıkça Sorulan</span>
            <br />
            <span className="font-black text-primary-foreground">Sorular</span>
          </h1>
          <p className="text-sm text-primary-foreground/50 mt-4 max-w-md leading-relaxed">
            Merak ettiğiniz konularda hızlı yanıtlar. Aradığınız cevabı bulamıyorsanız bize ulaşın.
          </p>
        </div>
      </section>

      <section ref={contentRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className={`reveal-on-scroll delay-${Math.min(i + 1, 3)} bg-card rounded-2xl border border-border px-6 overflow-hidden`}
              >
                <AccordionTrigger className="text-sm font-bold text-foreground hover:no-underline py-5 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="reveal-on-scroll mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Başka sorunuz mu var?
            </p>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 bg-foreground text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all text-sm"
            >
              İletişime Geçin
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
