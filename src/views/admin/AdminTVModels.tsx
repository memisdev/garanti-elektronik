"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Search, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TvModel {
  id: string;
  model_number: string;
  brand_id: string | null;
  screen_size: string | null;
  year: string | null;
  brand_name?: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  code: string | null;
}

interface Compatibility {
  id: string;
  product_id: string;
  product_name: string;
  product_code: string | null;
  notes: string | null;
}

const AdminTVModels = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<TvModel[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<TvModel | null>(null);
  const [compatibilities, setCompatibilities] = useState<Compatibility[]>([]);
  const [compLoading, setCompLoading] = useState(false);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ model_number: "", brand_id: "", screen_size: "", year: "" });
  const [saving, setSaving] = useState(false);

  // Add product state
  const [productSearch, setProductSearch] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    const { data } = await supabase.from("tv_models").select("*, brands(name)").order("model_number");
    if (data) {
      setModels(data.map((d: any) => ({ ...d, brand_name: d.brands?.name })));
    }
    setLoading(false);
  };

  const fetchBrands = async () => {
    const { data } = await supabase.from("brands").select("id, name").order("name");
    if (data) setBrands(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name, code").order("name");
    if (data) setProducts(data);
  };

  const fetchCompatibilities = async (modelId: string) => {
    setCompLoading(true);
    const { data } = await supabase
      .from("model_product_compatibility")
      .select("id, product_id, notes, products(name, code)")
      .eq("tv_model_id", modelId);
    if (data) {
      setCompatibilities(
        data.map((d: any) => ({
          id: d.id,
          product_id: d.product_id,
          product_name: d.products?.name ?? "",
          product_code: d.products?.code ?? null,
          notes: d.notes,
        }))
      );
    }
    setCompLoading(false);
  };

  useEffect(() => {
    fetchModels();
    fetchBrands();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedModel) fetchCompatibilities(selectedModel.id);
  }, [selectedModel?.id]);

  const handleSaveModel = async () => {
    if (!formData.model_number.trim()) return;
    setSaving(true);
    const payload = {
      model_number: formData.model_number.trim(),
      brand_id: formData.brand_id || null,
      screen_size: formData.screen_size || null,
      year: formData.year || null,
    };
    const { error } = await supabase.from("tv_models").insert(payload);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Model eklendi" });
      setFormOpen(false);
      setFormData({ model_number: "", brand_id: "", screen_size: "", year: "" });
      fetchModels();
    }
    setSaving(false);
  };

  const handleDeleteModel = async (id: string) => {
    if (!confirm("Bu modeli silmek istediğinize emin misiniz?")) return;
    await supabase.from("tv_models").delete().eq("id", id);
    if (selectedModel?.id === id) setSelectedModel(null);
    fetchModels();
    toast({ title: "Model silindi" });
  };

  const handleAddProduct = async (productId: string) => {
    if (!selectedModel) return;
    setAddingProduct(true);
    const { error } = await supabase.from("model_product_compatibility").insert({
      tv_model_id: selectedModel.id,
      product_id: productId,
    });
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      fetchCompatibilities(selectedModel.id);
    }
    setAddingProduct(false);
    setProductSearch("");
  };

  const handleRemoveProduct = async (compId: string) => {
    await supabase.from("model_product_compatibility").delete().eq("id", compId);
    if (selectedModel) fetchCompatibilities(selectedModel.id);
  };

  const assignedProductIds = new Set(compatibilities.map((c) => c.product_id));
  const filteredProducts = products.filter(
    (p) =>
      !assignedProductIds.has(p.id) &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(productSearch.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">TV Modelleri</h1>
        <Button onClick={() => setFormOpen(!formOpen)} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Yeni Model
        </Button>
      </div>

      {/* Add Model Form */}
      {formOpen && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Model Numarası *"
                value={formData.model_number}
                onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
              />
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Marka Seçin</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <Input
                placeholder="Ekran Boyutu"
                value={formData.screen_size}
                onChange={(e) => setFormData({ ...formData, screen_size: e.target.value })}
              />
              <Input
                placeholder="Yıl"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveModel} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Kaydet
              </Button>
              <Button variant="outline" onClick={() => setFormOpen(false)}>İptal</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Models List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Modeller ({models.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {models.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                      selectedModel?.id === m.id ? "bg-accent/10 border border-accent/30" : "hover:bg-muted/60"
                    }`}
                    onClick={() => setSelectedModel(m)}
                  >
                    <div>
                      <span className="text-sm font-semibold text-foreground">{m.model_number}</span>
                      {m.brand_name && <span className="ml-2 text-xs text-muted-foreground">{m.brand_name}</span>}
                      {m.screen_size && <span className="ml-2 text-[10px] text-muted-foreground/60">{m.screen_size}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteModel(m.id); }}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {models.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Henüz model eklenmemiş.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compatibility Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedModel ? `${selectedModel.model_number} — Uyumlu Parçalar` : "Bir model seçin"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedModel ? (
              <p className="text-sm text-muted-foreground text-center py-8">Soldaki listeden bir model seçin.</p>
            ) : compLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Add product search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ürün ara ve ekle..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-10"
                  />
                  {productSearch.length >= 2 && (
                    <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredProducts.slice(0, 8).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleAddProduct(p.id)}
                          disabled={addingProduct}
                          className="w-full text-left px-4 py-2.5 hover:bg-muted/60 text-sm transition-colors"
                        >
                          {p.name} {p.code && <span className="text-muted-foreground text-xs">({p.code})</span>}
                        </button>
                      ))}
                      {filteredProducts.length === 0 && (
                        <p className="px-4 py-3 text-sm text-muted-foreground">Sonuç bulunamadı</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Current compatibilities */}
                <div className="space-y-1">
                  {compatibilities.map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-muted/40 transition-colors">
                      <div>
                        <span className="text-sm text-foreground">{c.product_name}</span>
                        {c.product_code && <span className="ml-2 text-xs text-muted-foreground font-mono">{c.product_code}</span>}
                      </div>
                      <button onClick={() => handleRemoveProduct(c.id)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {compatibilities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Henüz uyumlu parça eklenmemiş.</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTVModels;
