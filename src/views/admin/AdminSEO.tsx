"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const pages = [
  { key: "home", label: "Ana Sayfa", titleKey: "seo_home_title", descKey: "seo_home_desc" },
  { key: "products", label: "Ürünler", titleKey: "seo_products_title", descKey: "seo_products_desc" },
  { key: "about", label: "Hakkımızda", titleKey: "seo_about_title", descKey: "seo_about_desc" },
  { key: "contact", label: "İletişim", titleKey: "seo_contact_title", descKey: "seo_contact_desc" },
];

const AdminSEO = () => {
  const [selected, setSelected] = useState(pages[0].key);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("key, value").like("key", "seo_%").then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((r) => { map[r.key] = r.value || ""; });
      setValues(map);
      setLoading(false);
    });
  }, []);

  const page = pages.find((p) => p.key === selected)!;
  const title = values[page.titleKey] || "";
  const desc = values[page.descKey] || "";

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of [[page.titleKey, title], [page.descKey, desc]]) {
      const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
      if (existing) {
        await supabase.from("site_settings").update({ value }).eq("key", key);
      } else {
        await supabase.from("site_settings").insert({ key, value });
      }
    }
    setSaving(false);
    toast({ title: "SEO ayarları kaydedildi." });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground mb-2">SEO Ayarları</h1>
      <p className="text-sm text-muted-foreground mb-8">Her sayfanın arama motorlarında nasıl göründüğünü buradan ayarlayabilirsiniz.</p>

      <div className="flex gap-1 mb-8 border-b border-border/50">
        {pages.map((p) => (
          <button key={p.key} onClick={() => setSelected(p.key)}
            className={`text-[13px] px-5 py-3 font-medium transition-colors relative ${selected === p.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {p.label}
            {selected === p.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-orange rounded-full" />}
          </button>
        ))}
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Yükleniyor...</p> : (
        <div className="bg-card border border-border/30 rounded-2xl p-8 space-y-5 max-w-lg">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Meta Başlık</label>
            <input type="text" value={title}
              onChange={(e) => setValues({ ...values, [page.titleKey]: e.target.value })}
              className="w-full h-12 text-sm px-4 border-0 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200" />
            <p className="text-[11px] text-muted-foreground mt-1">Meta başlık, arama motorlarında görünen başlık metnidir. ({title.length}/60 karakter)</p>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Meta Açıklama</label>
            <textarea rows={3} value={desc}
              onChange={(e) => setValues({ ...values, [page.descKey]: e.target.value })}
              className="w-full text-sm p-4 border-0 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none transition-all duration-200" />
            <p className="text-[11px] text-muted-foreground mt-1">Arama sonuçlarında başlığın altında görünen açıklama. ({desc.length}/160 karakter önerilir)</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-6 h-11 rounded-full transition-all duration-200 flex items-center gap-2 disabled:opacity-70">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Kaydet
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSEO;
