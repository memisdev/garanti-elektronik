"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuditLog } from "@/hooks/useAuditLog";
import { toast } from "@/hooks/use-toast";
import { slugify } from "@/lib/slugify";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const { log } = useAuditLog();

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) { toast({ title: "Hata", description: "Kategoriler yüklenemedi.", variant: "destructive" }); }
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: "", slug: "", description: "" }); setDialogOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || "" }); setDialogOpen(true); };

  const openDelete = async (c: Category) => {
    const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("category_id", c.id);
    setProductCount(count || 0);
    setDeleteTarget(c);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Kategori adı zorunludur.", variant: "destructive" }); return; }
    setSaving(true);
    const slug = form.slug || slugify(form.name);

    if (editing) {
      const { error } = await supabase.from("categories").update({ name: form.name, slug, description: form.description }).eq("id", editing.id);
      if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); setSaving(false); return; }
      await log("Kategori güncellendi", form.name);
      toast({ title: "Kategori güncellendi" });
    } else {
      const { error } = await supabase.from("categories").insert({ name: form.name, slug, description: form.description });
      if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); setSaving(false); return; }
      await log("Yeni kategori eklendi", form.name);
      toast({ title: "Kategori başarıyla eklendi" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    await log("Kategori silindi", deleteTarget.name);
    toast({ title: "Kategori silindi" });
    setDeleteTarget(null);
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Kategoriler</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-5 h-11 rounded-full transition-all duration-200">
          <Plus className="w-4 h-4" /> Yeni Kategori
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Ürünlerin gruplandığı kategorileri buradan yönetebilirsiniz.</p>

      {loading ? <p className="text-sm text-muted-foreground">Yükleniyor...</p> : categories.length === 0 ? (
        <div className="bg-card border border-border/30 rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
          Henüz kategori eklenmemiş. İlk kategorinizi eklemek için yukarıdaki butona tıklayın.
        </div>
      ) : (
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 bg-muted/50">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Kategori</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Slug</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Açıklama</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">İşlem</th>
            </tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-border/30 last:border-b-0 hover:bg-accent/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{c.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{c.slug}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.description}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button onClick={() => openDelete(c)} className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Kategori Düzenle" : "Yeni Kategori"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Kategori Adı *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
                className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10" placeholder="Ana Kart" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 font-mono" />
              <p className="text-[11px] text-muted-foreground mt-1">URL'de kullanılır, otomatik oluşturulur.</p>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Açıklama</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full text-sm p-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={handleSave} disabled={saving} className="bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-6 h-10 rounded-full transition-all duration-200 flex items-center gap-2 disabled:opacity-70">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editing ? "Güncelle" : "Ekle"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>"{deleteTarget?.name}"</strong> kategorisini silmek istediğinize emin misiniz?
              {productCount > 0 && <span className="block mt-2 text-destructive font-medium">⚠️ Bu kategoriye ait {productCount} ürün bulunmaktadır. Önce ürünleri başka kategoriye taşıyınız.</span>}
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

export default AdminCategories;
