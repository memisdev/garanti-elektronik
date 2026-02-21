import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePageContent } from "@/hooks/usePageContent";

const defaults = {
  intro: "Garanti Elektronik olarak kişisel verilerinizin korunmasına büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aşağıdaki bilgilendirmeyi sunuyoruz.",
  collected: "İletişim formu aracılığıyla ad, soyad, e-posta adresi ve mesaj içeriği bilgileriniz toplanmaktadır. Bu bilgiler yalnızca taleplerinize yanıt vermek amacıyla kullanılmaktadır.",
  storage: "Kişisel verileriniz, ilgili mevzuatta belirtilen sürelere uygun olarak saklanmakta ve süre sonunda güvenli şekilde imha edilmektedir.",
  rights: "KVKK kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini isteme, silinmesini talep etme haklarına sahipsiniz. Bu haklarınızı kullanmak için info@garantielektronik.com adresinden bizimle iletişime geçebilirsiniz.",
};

const PrivacyKVKK = () => {
  usePageMeta({ title: "Gizlilik ve KVKK Politikası | Garanti Elektronik", description: "Kişisel verilerin korunması ve KVKK kapsamındaki haklarınız hakkında bilgilendirme." });
  const contentRef = useRevealOnScroll();
  const { content } = usePageContent("privacy", defaults);

  return (
    <div>
      <section className="bg-foreground relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-5">
            <div className="accent-bar" />
            <span className="text-[11px] font-semibold text-primary-foreground/60 uppercase tracking-[0.2em]">Yasal</span>
          </div>
          <h1 className="text-[2.8rem] md:text-[3.5rem] tracking-[-0.04em] leading-[1.05]">
            <span className="font-light text-primary-foreground/50">Gizlilik ve</span>
            <br />
            <span className="font-black text-primary-foreground">KVKK Politikası</span>
          </h1>
        </div>
      </section>

      <section ref={contentRef} className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-2xl">
          <div className="reveal-on-scroll text-sm text-muted-foreground space-y-5 leading-relaxed">
            <p>{content.intro}</p>
          </div>

          <div className="reveal-on-scroll delay-1 mt-14">
            <h2 className="text-foreground font-bold text-lg mb-4">Toplanan Veriler</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{content.collected}</p>
          </div>

          <div className="reveal-on-scroll delay-2 mt-14">
            <h2 className="text-foreground font-bold text-lg mb-4">Verilerin Saklanması</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{content.storage}</p>
          </div>

          <div className="reveal-on-scroll delay-3 mt-14">
            <h2 className="text-foreground font-bold text-lg mb-4">Haklarınız</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{content.rights}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyKVKK;
