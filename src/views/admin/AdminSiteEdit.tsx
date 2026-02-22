"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const fields = [
  { key: "site_title", label: "Site Başlığı", type: "text", placeholder: "Garanti Elektronik", help: "Sitenin üst kısmında ve tarayıcı sekmesinde görünür." },
  { key: "site_subtitle", label: "Site Alt Başlık", type: "textarea", placeholder: "TV yedek parça ve anakart tedarikçiniz.", help: "Ana sayfadaki hero bölümünde görünür." },
  { key: "whatsapp_number", label: "WhatsApp Numarası", type: "text", placeholder: "905551234567", help: "WhatsApp butonu bu numaraya yönlendirir. Başında 90 ile yazın." },
  { key: "contact_phone", label: "Telefon Numarası", type: "text", placeholder: "+90 555 123 45 67", help: "İletişim sayfasında ve footer'da görünür." },
  { key: "contact_email", label: "E-posta Adresi", type: "text", placeholder: "info@garanti.com", help: "İletişim sayfasında ve footer'da görünür." },
  { key: "contact_address", label: "Adres", type: "textarea", placeholder: "İstanbul, Türkiye", help: "İletişim sayfasında görünür." },
  { key: "working_hours", label: "Çalışma Saatleri", type: "text", placeholder: "Pzt-Cmt: 09:00-18:00", help: "İletişim sayfasında görünür." },
];

const AdminSiteEdit = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("key, value");
        if (error) { toast({ title: "Yükleme hatası", description: "Ayarlar yüklenemedi.", variant: "destructive" }); }
        const map: Record<string, string> = {};
        (data || []).forEach((r) => { map[r.key] = r.value || ""; });
        setValues(map);
      } catch {
        toast({ title: "Yükleme hatası", description: "Ayarlar yüklenemedi.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const rows = fields.map((f) => ({ key: f.key, value: values[f.key] || "" }));
    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      toast({ title: "Kaydetme hatası", description: "Lütfen tekrar deneyin.", variant: "destructive" });
    } else {
      toast({ title: "Değişiklikler kaydedildi." });
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Yükleniyor...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground mb-2">Site Düzenleme</h1>
      <p className="text-sm text-muted-foreground mb-8">Sitenin genel bilgilerini ve iletişim ayarlarını buradan düzenleyebilirsiniz.</p>

      <div className="bg-card border border-border/30 rounded-2xl p-8 space-y-5 max-w-lg">
        {fields.map((f) => (
          <div key={f.key}>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">{f.label}</label>
              <Tooltip>
                <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground/50" /></TooltipTrigger>
                <TooltipContent><p className="text-xs max-w-[200px]">{f.help}</p></TooltipContent>
              </Tooltip>
            </div>
            {f.type === "textarea" ? (
              <textarea rows={3} value={values[f.key] || ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full text-sm p-4 border-0 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none transition-all duration-200" />
            ) : (
              <input type="text" value={values[f.key] || ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full h-12 text-sm px-4 border-0 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200" />
            )}
          </div>
        ))}
        <button onClick={handleSave} disabled={saving}
          className="bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-6 h-11 rounded-full transition-all duration-200 flex items-center gap-2 disabled:opacity-70 mt-4">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Kaydet
        </button>
      </div>
    </div>
  );
};

export default AdminSiteEdit;
