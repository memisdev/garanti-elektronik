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
  sections: { key: string; label: string; type: "text" | "textarea" | "list" | "faq_list" | "milestone_list" | "team_list" | "warranty_sections" }[];
}[] = [
  {
    key: "home_hero",
    label: "Ana Sayfa - Hero",
    sections: [
      { key: "title_light", label: "Başlık (açık)", type: "text" },
      { key: "title_bold", label: "Başlık (koyu)", type: "text" },
      { key: "subtitle", label: "Alt yazı", type: "textarea" },
    ],
  },
  {
    key: "home_cta",
    label: "Ana Sayfa - CTA",
    sections: [
      { key: "title", label: "Başlık", type: "textarea" },
      { key: "subtitle", label: "Alt yazı", type: "textarea" },
    ],
  },
  {
    key: "home_features",
    label: "Ana Sayfa - Özellikler",
    sections: [
      { key: "section_label", label: "Bölüm etiketi", type: "text" },
      { key: "section_title", label: "Bölüm başlığı", type: "text" },
      { key: "features", label: "Özellikler (başlık + açıklama)", type: "list" },
    ],
  },
  {
    key: "about",
    label: "Hakkımızda",
    sections: [
      { key: "hero_subtitle", label: "Hero alt yazı", type: "textarea" },
      { key: "intro", label: "Tanıtım paragrafları", type: "textarea" },
      { key: "mission", label: "Misyon", type: "textarea" },
      { key: "milestones", label: "Tarihçe", type: "milestone_list" },
      { key: "team", label: "Ekip", type: "team_list" },
      { key: "values", label: "Değerler", type: "list" },
    ],
  },
  {
    key: "contact",
    label: "İletişim",
    sections: [
      { key: "hero_subtitle", label: "Hero alt yazı", type: "textarea" },
    ],
  },
  {
    key: "faq",
    label: "SSS",
    sections: [
      { key: "hero_subtitle", label: "Hero alt yazı", type: "textarea" },
      { key: "items", label: "Sorular ve Cevaplar", type: "faq_list" },
    ],
  },
  {
    key: "warranty",
    label: "Garanti ve İade",
    sections: [
      { key: "hero_subtitle", label: "Hero alt yazı", type: "textarea" },
      { key: "sections", label: "Bölümler", type: "warranty_sections" },
    ],
  },
  {
    key: "privacy",
    label: "Gizlilik KVKK",
    sections: [
      { key: "intro", label: "Giriş paragrafı", type: "textarea" },
      { key: "collected", label: "Toplanan Veriler", type: "textarea" },
      { key: "storage", label: "Verilerin Saklanması", type: "textarea" },
      { key: "rights", label: "Haklarınız", type: "textarea" },
    ],
  },
  {
    key: "cookie",
    label: "Çerez Politikası",
    sections: [
      { key: "intro", label: "Giriş paragrafı", type: "textarea" },
      { key: "what_is", label: "Çerez Nedir?", type: "textarea" },
      { key: "types", label: "Kullandığımız Çerezler", type: "textarea" },
      { key: "manage", label: "Çerezleri Yönetme", type: "textarea" },
    ],
  },
];

type SectionData = Record<string, any>;

const AdminPageContents = () => {
  const [activePage, setActivePage] = useState(PAGE_DEFS[0].key);
  const [formData, setFormData] = useState<SectionData>({});
  const queryClient = useQueryClient();

  const pageDef = PAGE_DEFS.find((p) => p.key === activePage)!;

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
            { page_key: activePage, section_key: section.key, content: formData[section.key] },
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

  const updateField = (sectionKey: string, value: any) => {
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
                  <label className="text-[13px] font-semibold text-foreground mb-3 block">
                    {section.label}
                  </label>
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
  value: any;
  onChange: (v: any) => void;
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
