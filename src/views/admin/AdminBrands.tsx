"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuditLog } from "@/hooks/useAuditLog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const AdminBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const { log } = useAuditLog();

  const fetchBrands = async () => {
    const { data } = await supabase.from("brands").select("*").order("name");
    setBrands(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBrands(); }, []);

  const slugify = (text: string) => text.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (b: Brand) => {
    setEditing(b);
    setForm({ name: b.name, slug: b.slug, description: b.description || "" });
    setDialogOpen(true);
  };

  const openDelete = async (b: Brand) => {
    const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("brand_id", b.id);
    setProductCount(count || 0);
    setDeleteTarget(b);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Marka adı zorunludur.", variant: "destructive" }); return; }
    setSaving(true);
    const slug = form.slug || slugify(form.name);

    if (editing) {
      const { error } = await supabase.from("brands").update({ name: form.name, slug, description: form.description }).eq("id", editing.id);
      if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); setSaving(false); return; }
      await log("Marka güncellendi", form.name);
      toast({ title: "Marka güncellendi" });
    } else {
      const { error } = await supabase.from("brands").insert({ name: form.name, slug, description: form.description });
      if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); setSaving(false); return; }
      await log("Yeni marka eklendi", form.name);
      toast({ title: "Marka başarıyla eklendi" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchBrands();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("brands").delete().eq("id", deleteTarget.id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    await log("Marka silindi", deleteTarget.name);
    toast({ title: "Marka silindi" });
    setDeleteTarget(null);
    fetchBrands();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Markalar</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-5 h-11 rounded-full transition-all duration-200">
          <Plus className="w-4 h-4" /> Yeni Marka
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Ürünlerin ait olduğu markaları buradan yönetebilirsiniz.</p>

      {loading ? <p className="text-sm text-muted-foreground">Yükleniyor...</p> : brands.length === 0 ? (
        <div className="bg-card border border-border/30 rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
          Henüz marka eklenmemiş. İlk markanızı eklemek için yukarıdaki butona tıklayın.
        </div>
      ) : (
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 bg-muted/50">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Marka</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Slug</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Açıklama</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">İşlem</th>
            </tr></thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-b border-border/30 last:border-b-0 hover:bg-accent/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{b.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{b.slug}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{b.description}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button onClick={() => openDelete(b)} className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Marka Düzenle" : "Yeni Marka"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Marka Adı *</label>
              <input type="text" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) }); }}
                className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10" placeholder="Samsung" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 font-mono" placeholder="samsung" />
              <p className="text-[11px] text-muted-foreground mt-1">Slug alanı URL'de kullanılır ve otomatik oluşturulur.</p>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Açıklama</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full text-sm p-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none" placeholder="Marka hakkında kısa açıklama" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={handleSave} disabled={saving} className="bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-6 h-10 rounded-full transition-all duration-200 flex items-center gap-2 disabled:opacity-70">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editing ? "Güncelle" : "Ekle"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Markayı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>"{deleteTarget?.name}"</strong> markasını silmek istediğinize emin misiniz?
              {productCount > 0 && <span className="block mt-2 text-destructive font-medium">⚠️ Bu markaya ait {productCount} ürün bulunmaktadır. Önce ürünleri başka markaya taşıyınız.</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            {productCount === 0 && <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBrands;
