import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground" role="contentinfo">
      <div className="container mx-auto px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Company */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-6" aria-label="Garanti Elektronik Ana Sayfa">
              <Logo className="w-7 h-7 text-primary-foreground" darkInner />
              {siteConfig.name}
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
              TV yedek parça ve anakart tedarikçiniz. Tüm markalar için orijinal ve muadil parçalar.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Sayfalar">
            <h3 className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-6">Sayfalar</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/urunler" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Ürünler</Link></li>
              <li><Link to="/hakkimizda" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Hakkımızda</Link></li>
              <li><Link to="/iletisim" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">İletişim</Link></li>
              <li><Link to="/kargo-takip" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Kargo Takip</Link></li>
              <li><Link to="/sss" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Yasal">
            <h3 className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-6">Yasal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/garanti-iade" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Garanti ve İade</Link></li>
              <li><Link to="/gizlilik-kvkk" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Gizlilik / KVKK</Link></li>
              <li><Link to="/cerez-politikasi" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Çerez Politikası</Link></li>
            </ul>
          </nav>

          {/* Contact */}
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
