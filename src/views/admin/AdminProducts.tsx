"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuditLog } from "@/hooks/useAuditLog";
import { toast } from "@/hooks/use-toast";
import { escapeIlike } from "@/lib/escapeIlike";
import { slugify } from "@/lib/slugify";
import { MAX_FEATURED_PRODUCTS } from "@/config/site";
import { Search, Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight, Star, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  brand_id: string | null;
  category_id: string | null;
  compatibility: string | null;
  images: string[] | null;
  specs: unknown;
  is_featured: boolean;
  featured_order: number;
  brands?: { name: string } | null;
  categories?: { name: string } | null;
}

interface SelectOption { id: string; name: string; }

const PAGE_SIZE = 25;

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", code: "", brand_id: "", category_id: "", compatibility: "", images: [] as string[], specs: {} as Record<string, string> });
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [processingImages, setProcessingImages] = useState<Set<number>>(new Set());
  const { log } = useAuditLog();

  const removeBackground = async (imageUrl: string, index: number) => {
    // Extract storage path from full URL
    const match = imageUrl.match(/product-images\/(.+)$/);
    if (!match) {
      toast({ title: "Geçersiz görsel URL'si", variant: "destructive" });
      return;
    }
    const imagePath = decodeURIComponent(match[1]);

    setProcessingImages((prev) => new Set(prev).add(index));
    try {
      const resp = await fetch("/api/admin/process-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath }),
      });
      const data = await resp.json();
      const error = resp.ok ? null : { message: data.error ?? "Processing failed" };

      if (error || data?.error) {
        toast({ title: "Arka plan kaldırma başarısız", description: error?.message || data?.error, variant: "destructive" });
        return;
      }

      if (data?.processedUrl) {
        const newImages = [...form.images];
        newImages[index] = data.processedUrl;
        setForm({ ...form, images: newImages });
        toast({ title: "Arka plan kaldırıldı", description: "Görsel güncellendi." });
      }
    } catch (err) {
      console.error("Remove bg error:", err);
      toast({ title: "Hata oluştu", variant: "destructive" });
    } finally {
      setProcessingImages((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("products").select("*, brands(name), categories(name)", { count: "exact" });
    if (search) { const escaped = escapeIlike(search); query = query.or(`name.ilike.%${escaped}%,code.ilike.%${escaped}%`); }
    const { data, count } = await query.order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    setProducts(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    Promise.all([
      supabase.from("brands").select("id, name").order("name"),
      supabase.from("categories").select("id, name").order("name"),
    ]).then(([b, c]) => {
      setBrands(b.data || []);
      setCategories(c.data || []);
    });
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", code: "", brand_id: "", category_id: "", compatibility: "", images: [], specs: {} });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, slug: p.slug, code: p.code || "", brand_id: p.brand_id || "", category_id: p.category_id || "",
      compatibility: p.compatibility || "", images: p.images || [], specs: (p.specs && typeof p.specs === "object" && !Array.isArray(p.specs) ? p.specs : {}) as Record<string, string>,
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const newImages = [...form.images];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        newImages.push(urlData.publicUrl);
      }
    }
    setForm({ ...form, images: newImages });
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const addSpec = () => {
    if (!specKey.trim()) return;
    setForm({ ...form, specs: { ...form.specs, [specKey]: specVal } });
    setSpecKey("");
    setSpecVal("");
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...form.specs };
    delete newSpecs[key];
    setForm({ ...form, specs: newSpecs });
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Ürün adı zorunludur.", variant: "destructive" }); return; }
    setSaving(true);
    const slug = form.slug || slugify(form.name);
    const payload = {
      name: form.name, slug, code: form.code || null,
      brand_id: form.brand_id || null, category_id: form.category_id || null,
      compatibility: form.compatibility || null, images: form.images, specs: form.specs,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); setSaving(false); return; }
      await log("Ürün güncellendi", form.name);
      toast({ title: "Ürün güncellendi" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); setSaving(false); return; }
      await log("Yeni ürün eklendi", form.name);
      toast({ title: "Ürün başarıyla eklendi" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("products").delete().eq("id", deleteTarget.id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    await log("Ürün silindi", deleteTarget.name);
    toast({ title: "Ürün silindi" });
    setDeleteTarget(null);
    fetchProducts();
  };

  const handleToggleFeatured = async (p: Product) => {
    const featuredCount = products.filter((pr) => pr.is_featured).length;
    if (!p.is_featured && featuredCount >= MAX_FEATURED_PRODUCTS) {
      toast({ title: `Maksimum ${MAX_FEATURED_PRODUCTS} ürün öne çıkarılabilir.`, variant: "destructive" });
      return;
    }
    const { error } = await supabase
      .from("products")
      .update({ is_featured: !p.is_featured, featured_order: !p.is_featured ? featuredCount : 0 })
      .eq("id", p.id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    await log(p.is_featured ? "Ürün öne çıkarmadan kaldırıldı" : "Ürün öne çıkarıldı", p.name);
    fetchProducts();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Ürünler</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-5 h-11 rounded-full transition-all duration-200">
          <Plus className="w-4 h-4" /> Yeni Ürün
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Sitede listelenen tüm ürünleri buradan ekleyebilir, düzenleyebilir veya silebilirsiniz.</p>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Ürün adı veya kod ara..."
            className="w-full h-11 text-sm pl-10 pr-4 border-0 rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200" />
        </div>
        <span className="text-xs text-muted-foreground">{total} ürün</span>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Yükleniyor...</p> : products.length === 0 ? (
        <div className="bg-card border border-border/30 rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
          {search ? "Aramanızla eşleşen ürün bulunamadı." : "Henüz ürün eklenmemiş. İlk ürününüzü eklemek için yukarıdaki butona tıklayın."}
        </div>
      ) : (
        <>
          <div className="bg-card border border-border/30 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/50">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Ürün Adı</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Kod</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Marka</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Kategori</th>
                <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Öne Çıkan</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">İşlem</th>
              </tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 last:border-b-0 hover:bg-accent/50 transition-colors">
                    <td className="px-5 py-3.5 text-foreground font-medium">{p.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{p.code}</td>
                    <td className="px-5 py-3.5"><span className="text-[11px] font-medium bg-surface text-foreground px-3 py-1 rounded-full">{p.brands?.name || "–"}</span></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{p.categories?.name || "–"}</td>
                    <td className="px-5 py-3.5 text-center">
                      <button onClick={() => handleToggleFeatured(p)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${p.is_featured ? "text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20" : "text-muted-foreground hover:bg-surface"}`} title={p.is_featured ? "Öne çıkarmadan kaldır" : "Öne çıkar"}>
                        <Star className={`w-4 h-4 ${p.is_featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-9 h-9 rounded-xl bg-card border border-border/30 flex items-center justify-center disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-9 h-9 rounded-xl bg-card border border-border/30 flex items-center justify-center disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Ürün Düzenle" : "Yeni Ürün"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Ürün Adı *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
                className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 font-mono" />
                <p className="text-[11px] text-muted-foreground mt-1">URL'de kullanılır</p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Ürün Kodu</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Marka</label>
                <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                  className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10">
                  <option value="">Seçiniz</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Kategori</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10">
                  <option value="">Seçiniz</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Uyumluluk</label>
              <textarea rows={2} value={form.compatibility} onChange={(e) => setForm({ ...form, compatibility: e.target.value })}
                className="w-full text-sm p-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none" placeholder="Uyumlu TV modelleri..." />
            </div>

            {/* Images */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Görseller</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.images.map((img, i) => {
                  const isProcessingImg = processingImages.has(i);
                  return (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {isProcessingImg && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                        <button onClick={() => removeBackground(img, i)} disabled={isProcessingImg} title="Arka Plan Kaldır">
                          <Wand2 className="w-3 h-3 text-white" />
                        </button>
                        <button onClick={() => removeImage(i)} title="Kaldır">
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <label className="inline-flex items-center gap-2 text-[13px] text-muted-foreground bg-surface px-4 h-9 rounded-lg cursor-pointer hover:bg-accent transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Görsel Ekle
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Specs */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Teknik Özellikler</label>
              {Object.entries(form.specs).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-foreground bg-surface px-3 py-1.5 rounded-lg">{k}: {v}</span>
                  <button onClick={() => removeSpec(k)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input type="text" value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Özellik" className="flex-1 h-9 text-xs px-3 border border-border rounded-lg bg-background" />
                <input type="text" value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="Değer" className="flex-1 h-9 text-xs px-3 border border-border rounded-lg bg-background" />
                <button onClick={addSpec} className="h-9 px-3 bg-surface rounded-lg text-xs font-medium hover:bg-accent transition-colors">Ekle</button>
              </div>
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
            <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
            <AlertDialogDescription><strong>"{deleteTarget?.name}"</strong> ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
