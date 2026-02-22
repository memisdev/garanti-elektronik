"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Page definitions with their editable sections
const PAGE_DEFS: {
  key: string;
  label: string;
  sections: { key: string; label: string; description: string; type: "text" | "textarea" | "list" | "faq_list" | "milestone_list" | "team_list" | "warranty_sections" | "stat_list" }[];
}[] = [
  {
    key: "home_hero",
    label: "Ana Sayfa - Hero",
    sections: [
      { key: "title_light", label: "Başlık (açık)", description: "Ana sayfa açılışındaki büyük başlığın ince yazı kısmı", type: "text" },
      { key: "title_bold", label: "Başlık (koyu)", description: "Ana sayfa açılışındaki büyük başlığın kalın yazı kısmı", type: "text" },
      { key: "subtitle", label: "Alt yazı", description: "Ana sayfa başlığının altındaki açıklama paragrafı", type: "textarea" },
    ],
  },
  {
    key: "home_cta",
    label: "Ana Sayfa - CTA",
    sections: [
      { key: "title", label: "Başlık", description: "Ana sayfanın alt kısmındaki koyu bölümdeki başlık", type: "textarea" },
      { key: "subtitle", label: "Alt yazı", description: "Ana sayfanın alt kısmındaki koyu bölümdeki açıklama", type: "textarea" },
    ],
  },
  {
    key: "home_features",
    label: "Ana Sayfa - Özellikler",
    sections: [
      { key: "section_label", label: "Bölüm etiketi", description: "Özellikler bölümünün üstündeki küçük etiket (örn: Neden Biz?)", type: "text" },
      { key: "section_title", label: "Bölüm başlığı", description: "Özellikler bölümünün ana başlığı", type: "text" },
      { key: "features", label: "Özellikler (başlık + açıklama)", description: "4 özellik kartı — her biri 'Başlık|Açıklama' formatında", type: "list" },
    ],
  },
  {
    key: "home_stats",
    label: "Ana Sayfa - İstatistikler",
    sections: [
      { key: "stats", label: "İstatistikler", description: "Ana sayfadaki 4 büyük istatistik (örn: 500+ Ürün Çeşidi)", type: "stat_list" },
    ],
  },
  {
    key: "about",
    label: "Hakkımızda",
    sections: [
      { key: "hero_subtitle", label: "Hero alt yazı", description: "Hakkımızda sayfasının üst kısmındaki açıklama", type: "textarea" },
      { key: "intro", label: "Tanıtım paragrafları", description: "Hakkımızda tanıtım paragrafları", type: "textarea" },
      { key: "mission", label: "Misyon", description: "Misyonumuz bölümündeki metin", type: "textarea" },
      { key: "milestones", label: "Tarihçe", description: "Tarihçe zaman çizelgesi — yıl ve olay", type: "milestone_list" },
      { key: "team", label: "Ekip", description: "Ekip bölümü — rol, sayı ve açıklama", type: "team_list" },
      { key: "values", label: "Değerler", description: "Değerlerimiz listesi", type: "list" },
      { key: "stats", label: "İstatistikler", description: "Hakkımızda sayfasındaki 4 istatistik kutusu", type: "stat_list" },
    ],
  },
  {
    key: "contact",
    label: "İletişim",
    sections: [
      { key: "hero_subtitle", label: "Hero alt yazı", description: "İletişim sayfasının üst kısmındaki açıklama", type: "textarea" },
    ],
  },
  {
    key: "faq",
    label: "SSS",
    sections: [
      { key: "hero_subtitle", label: "Hero alt yazı", description: "SSS sayfasının üst kısmındaki açıklama", type: "textarea" },
      { key: "items", label: "Sorular ve Cevaplar", description: "Sık sorulan sorular ve cevapları", type: "faq_list" },
    ],
  },
  {
    key: "warranty",
    label: "Garanti ve İade",
    sections: [
      { key: "hero_subtitle", label: "Hero alt yazı", description: "Garanti/İade sayfası üst açıklama", type: "textarea" },
      { key: "sections", label: "Bölümler", description: "Garanti ve iade politikası bölümleri", type: "warranty_sections" },
    ],
  },
  {
    key: "privacy",
    label: "Gizlilik KVKK",
    sections: [
      { key: "intro", label: "Giriş paragrafı", description: "Gizlilik politikası giriş paragrafı", type: "textarea" },
      { key: "collected", label: "Toplanan Veriler", description: "Gizlilik politikası — toplanan veriler bölümü", type: "textarea" },
      { key: "storage", label: "Verilerin Saklanması", description: "Gizlilik politikası — verilerin saklanması bölümü", type: "textarea" },
      { key: "rights", label: "Haklarınız", description: "Gizlilik politikası — haklarınız bölümü", type: "textarea" },
    ],
  },
  {
    key: "cookie",
    label: "Çerez Politikası",
    sections: [
      { key: "intro", label: "Giriş paragrafı", description: "Çerez politikası giriş paragrafı", type: "textarea" },
      { key: "what_is", label: "Çerez Nedir?", description: "Çerez politikası — çerez nedir bölümü", type: "textarea" },
      { key: "types", label: "Kullandığımız Çerezler", description: "Çerez politikası — kullanılan çerez türleri bölümü", type: "textarea" },
      { key: "manage", label: "Çerezleri Yönetme", description: "Çerez politikası — çerezleri yönetme bölümü", type: "textarea" },
    ],
  },
];

type SectionData = Record<string, unknown>;

const AdminPageContents = () => {
  const [activePage, setActivePage] = useState(PAGE_DEFS[0].key);
  const [formData, setFormData] = useState<SectionData>({});
  const queryClient = useQueryClient();

  const pageDef = PAGE_DEFS.find((p) => p.key === activePage);
  if (!pageDef) return null;

  const { data: dbRows, isLoading } = useQuery({
    queryKey: ["admin-page-contents", activePage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_contents")
        .select("*")
        .eq("page_key", activePage);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!dbRows) return;
    const mapped: SectionData = {};
    for (const row of dbRows) {
      mapped[row.section_key] = row.content;
    }
    setFormData(mapped);
  }, [dbRows]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const section of pageDef.sections) {
        if (formData[section.key] === undefined) continue;
        const { error } = await supabase
          .from("page_contents")
          .upsert(
            { page_key: activePage, section_key: section.key, content: formData[section.key] as import("@/integrations/supabase/types").Json },
            { onConflict: "page_key,section_key" }
          );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Kaydedildi!" });
      queryClient.invalidateQueries({ queryKey: ["page-contents", activePage] });
      queryClient.invalidateQueries({ queryKey: ["admin-page-contents", activePage] });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kaydedilemedi.", variant: "destructive" });
    },
  });

  const updateField = (sectionKey: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [sectionKey]: value }));
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground mb-6">Sayfa İçerikleri</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {PAGE_DEFS.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePage(p.key)}
                className={`text-left text-[13px] px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
                  activePage === p.key
                    ? "bg-foreground text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Editor */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              {pageDef.sections.map((section) => (
                <div key={section.key} className="bg-card rounded-xl border border-border p-5">
                  <label className="text-[13px] font-semibold text-foreground mb-1 block">
                    {section.label}
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">{section.description}</p>
                  <SectionEditor
                    type={section.type}
                    value={formData[section.key]}
                    onChange={(v) => updateField(section.key, v)}
                  />
                </div>
              ))}

              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-2 bg-foreground text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50"
              >
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Kaydet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function SectionEditor({
  type,
  value,
  onChange,
}: {
  type: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (type === "text") {
    return (
      <input
        type="text"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 text-sm px-3 border border-border rounded-lg bg-background"
      />
    );
  }

  if (type === "textarea") {
    return (
      <Textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="text-sm"
      />
    );
  }

  if (type === "list") {
    const items: string[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 h-10 text-sm px-3 border border-border rounded-lg bg-background"
            />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-destructive p-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-3 h-3" /> Ekle
        </button>
      </div>
    );
  }

  if (type === "stat_list") {
    const items: { value: string; label: string }[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder="Değer (örn: 500+)"
              value={item.value}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, value: e.target.value };
                onChange(next);
              }}
              className="w-24 h-10 text-sm px-3 border border-border rounded-lg bg-background"
            />
            <input
              type="text"
              placeholder="Etiket (örn: Ürün Çeşidi)"
              value={item.label}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, label: e.target.value };
                onChange(next);
              }}
              className="flex-1 h-10 text-sm px-3 border border-border rounded-lg bg-background"
            />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-destructive p-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...items, { value: "", label: "" }])}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-3 h-3" /> Ekle
        </button>
      </div>
    );
  }

  if (type === "faq_list") {
    const items: { q: string; a: string }[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-background rounded-lg p-3 border border-border space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Soru"
                value={item.q}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, q: e.target.value };
                  onChange(next);
                }}
                className="flex-1 h-9 text-sm px-3 border border-border rounded-lg bg-card"
              />
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-destructive p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Textarea
              placeholder="Cevap"
              value={item.a}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, a: e.target.value };
                onChange(next);
              }}
              rows={2}
              className="text-sm"
            />
          </div>
        ))}
        <button
          onClick={() => onChange([...items, { q: "", a: "" }])}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-3 h-3" /> Soru Ekle
        </button>
      </div>
    );
  }

  if (type === "milestone_list") {
    const items: { year: string; event: string }[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder="Yıl"
              value={item.year}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, year: e.target.value };
                onChange(next);
              }}
              className="w-20 h-10 text-sm px-3 border border-border rounded-lg bg-background"
            />
            <input
              type="text"
              placeholder="Olay"
              value={item.event}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, event: e.target.value };
                onChange(next);
              }}
              className="flex-1 h-10 text-sm px-3 border border-border rounded-lg bg-background"
            />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-destructive p-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...items, { year: "", event: "" }])}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-3 h-3" /> Ekle
        </button>
      </div>
    );
  }

  if (type === "team_list") {
    const items: { role: string; count: string; desc: string }[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-background rounded-lg p-3 border border-border space-y-2">
            <div className="flex gap-2">
              <input type="text" placeholder="Rol" value={item.role}
                onChange={(e) => { const n = [...items]; n[i] = { ...item, role: e.target.value }; onChange(n); }}
                className="flex-1 h-9 text-sm px-3 border border-border rounded-lg bg-card" />
              <input type="text" placeholder="Kişi sayısı" value={item.count}
                onChange={(e) => { const n = [...items]; n[i] = { ...item, count: e.target.value }; onChange(n); }}
                className="w-28 h-9 text-sm px-3 border border-border rounded-lg bg-card" />
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-destructive p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input type="text" placeholder="Açıklama" value={item.desc}
              onChange={(e) => { const n = [...items]; n[i] = { ...item, desc: e.target.value }; onChange(n); }}
              className="w-full h-9 text-sm px-3 border border-border rounded-lg bg-card" />
          </div>
        ))}
        <button
          onClick={() => onChange([...items, { role: "", count: "", desc: "" }])}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-3 h-3" /> Ekle
        </button>
      </div>
    );
  }

  if (type === "warranty_sections") {
    const items: { title: string; items: string[] }[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-4">
        {items.map((section, i) => (
          <div key={i} className="bg-background rounded-lg p-4 border border-border space-y-3">
            <div className="flex gap-2">
              <input type="text" placeholder="Bölüm başlığı" value={section.title}
                onChange={(e) => { const n = [...items]; n[i] = { ...section, title: e.target.value }; onChange(n); }}
                className="flex-1 h-9 text-sm px-3 border border-border rounded-lg bg-card font-medium" />
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-destructive p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {section.items.map((item, j) => (
              <div key={j} className="flex gap-2 ml-4">
                <input type="text" value={item}
                  onChange={(e) => {
                    const n = [...items];
                    const newItems = [...section.items];
                    newItems[j] = e.target.value;
                    n[i] = { ...section, items: newItems };
                    onChange(n);
                  }}
                  className="flex-1 h-9 text-sm px-3 border border-border rounded-lg bg-card" />
                <button onClick={() => {
                  const n = [...items];
                  n[i] = { ...section, items: section.items.filter((_, k) => k !== j) };
                  onChange(n);
                }} className="text-destructive p-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const n = [...items];
                n[i] = { ...section, items: [...section.items, ""] };
                onChange(n);
              }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-4"
            >
              <Plus className="w-3 h-3" /> Madde Ekle
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...items, { title: "", items: [""] }])}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-3 h-3" /> Bölüm Ekle
        </button>
      </div>
    );
  }

  return null;
}

export default AdminPageContents;
