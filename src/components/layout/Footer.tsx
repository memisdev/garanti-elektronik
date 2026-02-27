import Link from "next/link";
import Image from "next/image";
// Note: Footer is server-compatible (no state/effects). No "use client" needed.
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

const FOOTER_CATEGORIES = [
  { name: "Anakart / Mainboard", slug: "anakart-mainboard" },
  { name: "Power Board", slug: "besleme-powerboard" },
  { name: "Inverter Board", slug: "inverter-board" },
  { name: "LED Driver", slug: "led-driver" },
  { name: "T-CON Board", slug: "tcon" },
  { name: "Uzaktan Kumanda", slug: "uzaktan-kumanda" },
];

const FOOTER_BRANDS = [
  { name: "Samsung", slug: "samsung" },
  { name: "LG", slug: "lg" },
  { name: "Vestel", slug: "vestel" },
  { name: "Arçelik", slug: "arcelik" },
  { name: "Beko", slug: "beko" },
  { name: "Philips", slug: "philips" },
  { name: "Grundig", slug: "grundig" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground" role="contentinfo">
      <div className="container mx-auto px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Company */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-6" aria-label="Garanti Elektronik Ana Sayfa">
              <Image src="/logo.png" alt="Garanti Elektronik" width={44} height={40} className="h-7 w-auto" />
              {siteConfig.name}
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
              TV yedek parça ve anakart tedarikçiniz. Tüm markalar için orijinal ve muadil parçalar.
            </p>
          </div>

          {/* Kategoriler */}
          <nav aria-label="Kategoriler">
            <h3 className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-6">Kategoriler</h3>
            <ul className="space-y-3 text-sm">
              {FOOTER_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/kategori/${cat.slug}`} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popüler Markalar */}
          <nav aria-label="Popüler Markalar">
            <h3 className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-6">Popüler Markalar</h3>
            <ul className="space-y-3 text-sm">
              {FOOTER_BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <Link href={`/marka/${brand.slug}`} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sayfalar */}
          <nav aria-label="Sayfalar">
            <h3 className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-6">Sayfalar</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/urunler" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Ürünler</Link></li>
              <li><Link href="/parca-bulucu" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Parça Bulucu</Link></li>
              <li><Link href="/hakkimizda" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">İletişim</Link></li>
              <li><Link href="/sss" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">S.S.S.</Link></li>
              <li><Link href="/garanti-iade" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Garanti ve İade</Link></li>
            </ul>
          </nav>

          {/* İletişim */}
          <div>
            <h3 className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-6">İletişim</h3>
            <address className="not-italic space-y-3 text-sm text-primary-foreground/70">
              <p>{siteConfig.contact.address}</p>
              <p><a href={siteConfig.contact.phoneHref} className="hover:text-primary-foreground transition-colors">{siteConfig.contact.phone}</a></p>
              <p><a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary-foreground transition-colors">{siteConfig.contact.email}</a></p>
            </address>
            <a
              href={siteConfig.social.whatsappUrl("Merhaba, bilgi almak istiyorum.")}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground text-xs font-medium px-5 py-2.5 rounded-full transition-all duration-200 mt-6"
              aria-label="WhatsApp ile iletişime geçin"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-20 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır. · Developed by{" "}
          <a href="https://github.com/memisdev" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">memisdev</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
