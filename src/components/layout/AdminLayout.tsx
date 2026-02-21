import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Tag, FolderTree, Search as SearchIcon, FileEdit, Image, Users, ScrollText, LogOut, Tv, MessageSquare, Menu, X, FileText } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SkeletonPage from "@/components/SkeletonPage";

const sidebarItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Ürünler", to: "/admin/urunler", icon: Package },
  { label: "Markalar", to: "/admin/markalar", icon: Tag },
  { label: "Kategoriler", to: "/admin/kategoriler", icon: FolderTree },
  { label: "Mesajlar", to: "/admin/mesajlar", icon: MessageSquare, badge: true },
  { label: "SEO", to: "/admin/seo", icon: SearchIcon },
  { label: "Site Düzenleme", to: "/admin/site-duzenle", icon: FileEdit },
  { label: "Medya", to: "/admin/medya", icon: Image },
  { label: "Kullanıcılar", to: "/admin/kullanicilar", icon: Users },
  { label: "İşlem Kaydı", to: "/admin/islem-kaydi", icon: ScrollText },
  { label: "TV Modelleri", to: "/admin/tv-modelleri", icon: Tv },
  { label: "Sayfa İçerikleri", to: "/admin/sayfa-icerikleri", icon: FileText },
];

const AdminLayout = () => {
  const location = useLocation();
  const { loading, signOut } = useAdminAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .then(({ count }) => setUnreadCount(count || 0));
  }, [location.pathname]);

  if (loading) return <SkeletonPage />;

  const NavItems = () => (
    <>
      {sidebarItems.map((item) => {
        const active = location.pathname === item.to;
        return (
          <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 text-[13px] px-4 h-11 rounded-xl transition-all duration-200 relative ${active ? "bg-surface text-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
            {active && <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-accent-orange rounded-full" />}
            <item.icon className="w-4 h-4" />
            {item.label}
            {item.badge && unreadCount > 0 && (
              <span className="ml-auto bg-accent-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border/50 shrink-0">
        <div className="h-16 px-6 flex items-center border-b border-border/50">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 font-semibold text-sm text-foreground">
            <span className="w-8 h-8 bg-foreground rounded-xl flex items-center justify-center text-background text-[10px] font-bold">GE</span>
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItems />
        </nav>
        <div className="p-4 border-t border-border/50">
          <button onClick={signOut} className="flex items-center gap-3 text-[13px] text-muted-foreground hover:text-destructive px-4 h-11 rounded-xl w-full transition-colors">
            <LogOut className="w-4 h-4" /> Çıkış
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border/50 flex flex-col animate-in slide-in-from-left">
            <div className="h-16 px-6 flex items-center justify-between border-b border-border/50">
              <span className="font-semibold text-sm text-foreground">Admin Panel</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavItems />
            </nav>
            <div className="p-4 border-t border-border/50">
              <button onClick={signOut} className="flex items-center gap-3 text-[13px] text-muted-foreground hover:text-destructive px-4 h-11 rounded-xl w-full transition-colors">
                <LogOut className="w-4 h-4" /> Çıkış
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden"><Menu className="w-5 h-5 text-foreground" /></button>
          <div className="hidden lg:flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Hoş geldiniz, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold">A</div>
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors lg:hidden">Çıkış</button>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
