import { Package, Tag, FolderTree, Tv, MessageSquare, Plus, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Stats {
  products: number;
  brands: number;
  categories: number;
  tvModels: number;
  unreadMessages: number;
}

interface ActivityItem {
  action: string;
  detail: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ products: 0, brands: 0, categories: 0, tvModels: 0, unreadMessages: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [products, brands, categories, tvModels, messages, recentActivity] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("brands").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("tv_models").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("audit_log").select("action, detail, created_at").order("created_at", { ascending: false }).limit(10),
      ]);

      setStats({
        products: products.count || 0,
        brands: brands.count || 0,
        categories: categories.count || 0,
        tvModels: tvModels.count || 0,
        unreadMessages: messages.count || 0,
      });
      setActivity(recentActivity.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Ürünler", value: stats.products, icon: Package, to: "/admin/urunler" },
    { label: "Markalar", value: stats.brands, icon: Tag, to: "/admin/markalar" },
    { label: "Kategoriler", value: stats.categories, icon: FolderTree, to: "/admin/kategoriler" },
    { label: "TV Modelleri", value: stats.tvModels, icon: Tv, to: "/admin/tv-modelleri" },
    { label: "Okunmamış Mesajlar", value: stats.unreadMessages, icon: MessageSquare, to: "/admin/mesajlar" },
  ];

  const total = stats.products + stats.brands + stats.categories;
  const showOnboarding = !loading && total < 3;

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Az önce";
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Dashboard</h1>
        <Tooltip>
          <TooltipTrigger><Info className="w-4 h-4 text-muted-foreground" /></TooltipTrigger>
          <TooltipContent><p className="text-xs max-w-[200px]">Bu sayılar veritabanından canlı olarak çekilmektedir.</p></TooltipContent>
        </Tooltip>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {statCards.map((s) => (
          <Link key={s.label} to={s.to} className="bg-card border-l-4 border-l-accent-orange border border-border/30 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-foreground"><s.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-extrabold text-foreground leading-none">{loading ? "–" : s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Onboarding */}
      {showOnboarding && (
        <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-2xl p-6 mb-10">
          <h2 className="text-sm font-bold text-foreground mb-4">🚀 Başlangıç Rehberi</h2>
          <p className="text-sm text-muted-foreground mb-4">Sitenizi yönetmeye başlamak için aşağıdaki adımları takip edin:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${stats.brands > 0 ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>1</span>
              <span className="text-sm text-foreground">Önce <Link to="/admin/markalar" className="text-accent-orange font-medium underline">markaları</Link> ekleyin</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${stats.categories > 0 ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>2</span>
              <span className="text-sm text-foreground">Sonra <Link to="/admin/kategoriler" className="text-accent-orange font-medium underline">kategorileri</Link> oluşturun</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${stats.products > 0 ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>3</span>
              <span className="text-sm text-foreground">Son olarak <Link to="/admin/urunler" className="text-accent-orange font-medium underline">ürünleri</Link> ekleyin</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link to="/admin/urunler" className="flex items-center gap-2 bg-foreground text-background text-[13px] font-semibold px-5 h-10 rounded-full hover:bg-primary-hover transition-colors">
          <Plus className="w-4 h-4" /> Yeni Ürün Ekle
        </Link>
        <Link to="/admin/markalar" className="flex items-center gap-2 bg-card border border-border/30 text-foreground text-[13px] font-medium px-5 h-10 rounded-full hover:bg-accent transition-colors">
          <Plus className="w-4 h-4" /> Yeni Marka Ekle
        </Link>
        <Link to="/admin/mesajlar" className="flex items-center gap-2 bg-card border border-border/30 text-foreground text-[13px] font-medium px-5 h-10 rounded-full hover:bg-accent transition-colors">
          <MessageSquare className="w-4 h-4" /> Mesajları Gör <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Recent Activity */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-5">Son İşlemler</p>
      <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
        {activity.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Henüz işlem kaydı bulunmamaktadır. Yaptığınız tüm işlemler burada görünecektir.
          </div>
        ) : (
          activity.map((a, i) => (
            <div key={i} className={`flex items-start gap-4 px-6 py-5 ${i > 0 ? "border-t border-border/50" : ""}`}>
              <div className="w-2 h-2 rounded-full bg-accent-orange mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{a.action}</span>
                {a.detail && <span className="text-sm text-muted-foreground"> — {a.detail}</span>}
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(a.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
