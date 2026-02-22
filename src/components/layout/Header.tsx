"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SearchBar = lazy(() => import("@/components/SearchBar"));

const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);

  const isLightHero = pathname === "/parca-bulucu";
  const isOverlay = !isLightHero && !scrolled;

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    const updateHeader = () => {
      const y = window.scrollY;
      setScrolled(y > 100);
      setVisible(y < lastY || y < 80);
      lastY = y;
      ticking = false;
    };
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateHeader();
    return () => {
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { label: "Ürünler", href: "/urunler" },
    
    { label: "Kargo Takip", href: "/kargo-takip" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "İletişim", href: "/iletisim" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? "bg-background/95 lg:bg-background/80 lg:backdrop-blur-xl border-b border-border/40 shadow-[0_1px_3px_0_hsl(var(--foreground)/0.04)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-[72px] px-6">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo className={`w-8 h-8 transition-all duration-500 group-hover:scale-105 ${isOverlay ? "text-primary-foreground" : "text-foreground"}`} darkInner={isOverlay} />
            <div className="hidden sm:flex flex-col leading-none">
              <span className={`text-[15px] font-bold tracking-tight transition-colors duration-500 ${isOverlay ? "text-primary-foreground" : "text-foreground"}`}>Garanti Elektronik</span>
            </div>
            <span className={`sm:hidden text-[15px] font-bold tracking-tight transition-colors duration-500 ${isOverlay ? "text-primary-foreground" : "text-foreground"}`}>Garanti</span>
          </Link>

          {/* Center: Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[13px] font-medium px-3.5 py-2 transition-all duration-500 ${
                  isOverlay
                    ? "text-primary-foreground/70 hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-500 ${
                isOverlay
                  ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              aria-label="Ara"
            >
              <Search className="w-[17px] h-[17px]" strokeWidth={1.8} />
            </button>

            <div className={`hidden sm:block w-px h-5 mx-1 transition-colors duration-500 ${isOverlay ? "bg-primary-foreground/20" : "bg-border/60"}`} />

            <Link
              href="/parca-bulucu"
              className={`hidden sm:inline-flex text-[13px] font-medium px-3 py-2 rounded-full transition-all duration-500 ${
                isOverlay
                  ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              Parça Bulucu
            </Link>

            <Link
              href="/urunler"
              className={`hidden sm:inline-flex items-center gap-1.5 text-[12px] font-semibold px-5 py-2.5 rounded-full transition-all duration-500 ${
                isOverlay
                  ? "border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              Ürünleri İncele
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className={`lg:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all duration-500 ${isOverlay ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-muted/60"}`} aria-label="Menü">
                  <Menu className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0 border-r border-border/40">
                <div className="p-8 pt-10">
                  <Link href="/" className="flex items-center gap-2.5 mb-14" onClick={() => setMobileOpen(false)}>
                    <Logo className="w-8 h-8 text-foreground" />
                    <span className="text-[15px] font-bold tracking-tight">Garanti Elektronik</span>
                  </Link>

                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 px-3">Menü</p>
                  <nav className="flex flex-col gap-0.5">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-[15px] font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 px-3 py-3.5 rounded-xl transition-all duration-200"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-12 space-y-3">
                    <Link
                      href="/urunler"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-foreground text-background text-[13px] font-semibold px-4 py-3.5 rounded-xl transition-all duration-200 hover:opacity-90"
                    >
                      Ürünleri İncele
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/iletisim"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full border border-border text-foreground text-[13px] font-medium px-4 py-3.5 rounded-xl transition-all duration-200 hover:bg-muted/40"
                    >
                      Bize Ulaşın
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] search-overlay-backdrop" role="dialog" aria-label="Ürün arama" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-md" />
          <div className="relative pt-24 px-4" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-2xl mx-auto search-overlay-content">
              <div className="bg-background rounded-2xl shadow-[0_32px_64px_-16px_hsl(var(--foreground)/0.25)] p-8 border border-border/60">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">Ürün Ara</p>
                  </div>
                  <button onClick={() => setSearchOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/60 transition-all duration-200">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <Suspense fallback={<div className="h-13 bg-surface rounded-2xl animate-pulse" />}>
                  <SearchBar onNavigate={() => setSearchOpen(false)} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
