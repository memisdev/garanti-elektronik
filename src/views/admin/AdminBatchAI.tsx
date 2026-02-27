"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Wand2, Sparkles } from "lucide-react";

interface BatchProduct {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  brand_id: string | null;
  category_id: string | null;
  compatibility: string | null;
  description: string | null;
  specs: Record<string, string> | null;
  brands?: { name: string } | null;
  categories?: { name: string } | null;
}

interface LogEntry {
  id: string;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
}

type FilterMode = "missing_description" | "all";
type Operation = "generate_names" | "generate_descriptions";

const DELAY_BETWEEN_REQUESTS = 500;
const RETRY_DELAY = 5000;
const MAX_RETRIES = 2;

const AdminBatchAI = () => {
  const [products, setProducts] = useState<BatchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("missing_description");
  const [operation, setOperation] = useState<Operation>("generate_descriptions");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const pausedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("id, name, slug, code, brand_id, category_id, compatibility, description, specs, brands(name), categories(name)")
      .order("created_at", { ascending: false });
    setProducts((data as BatchProduct[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const filteredProducts = filter === "missing_description"
    ? products.filter((p) => !p.description?.trim())
    : products;

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitWhilePaused = async () => {
    while (pausedRef.current) {
      await sleep(200);
    }
  };

  const callWithRetry = async (
    url: string,
    body: Record<string, unknown>,
    signal: AbortSignal,
    retries = 0,
  ): Promise<{ ok: boolean; data: Record<string, string> }> => {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    const data = await resp.json();

    if (resp.status === 429 && retries < MAX_RETRIES) {
      await sleep(RETRY_DELAY * (retries + 1));
      return callWithRetry(url, body, signal, retries + 1);
    }

    return { ok: resp.ok, data };
  };

  const handleStart = async () => {
    if (filteredProducts.length === 0) {
      toast({ title: "İşlenecek ürün yok", variant: "destructive" });
      return;
    }

    setRunning(true);
    setPaused(false);
    pausedRef.current = false;
    setProcessed(0);
    setSuccessCount(0);
    setErrorCount(0);
    setLogs([]);

    const controller = new AbortController();
    abortRef.current = controller;

    for (let i = 0; i < filteredProducts.length; i++) {
      if (controller.signal.aborted) break;
      await waitWhilePaused();
      if (controller.signal.aborted) break;

      const product = filteredProducts[i];

      try {
        if (operation === "generate_names") {
          const hasContext = product.code || product.brands?.name || product.categories?.name || product.compatibility;
          if (!hasContext) {
            setLogs((prev) => [...prev, { id: product.id, name: product.name, status: "skipped", message: "Yeterli bilgi yok" }]);
            setProcessed((p) => p + 1);
            continue;
          }

          const { ok, data } = await callWithRetry(
            "/api/admin/generate-product-name",
            {
              code: product.code || undefined,
              brand: product.brands?.name || undefined,
              category: product.categories?.name || undefined,
              compatibility: product.compatibility || undefined,
              currentName: product.name || undefined,
            },
            controller.signal,
          );

          if (!ok) {
            setLogs((prev) => [...prev, { id: product.id, name: product.name, status: "error", message: data.error || "Bilinmeyen hata" }]);
            setErrorCount((c) => c + 1);
          } else {
            // Save to Supabase
            const slug = product.slug; // keep existing slug
            const { error: updateError } = await supabase
              .from("products")
              .update({ name: data.name, slug })
              .eq("id", product.id);

            if (updateError) {
              setLogs((prev) => [...prev, { id: product.id, name: product.name, status: "error", message: `Kayıt hatası: ${updateError.message}` }]);
              setErrorCount((c) => c + 1);
            } else {
              setLogs((prev) => [...prev, { id: product.id, name: product.name, status: "success", message: data.name }]);
              setSuccessCount((c) => c + 1);
            }
          }
        } else {
          // generate_descriptions
          const { ok, data } = await callWithRetry(
            "/api/admin/generate-product-description",
            {
              name: product.name,
              code: product.code || undefined,
              brand: product.brands?.name || undefined,
              category: product.categories?.name || undefined,
              compatibility: product.compatibility || undefined,
              specs: product.specs ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join(", ") : undefined,
            },
            controller.signal,
          );

          if (!ok) {
            setLogs((prev) => [...prev, { id: product.id, name: product.name, status: "error", message: data.error || "Bilinmeyen hata" }]);
            setErrorCount((c) => c + 1);
          } else {
            const { error: updateError } = await supabase
              .from("products")
              .update({ description: data.description })
              .eq("id", product.id);

            if (updateError) {
              setLogs((prev) => [...prev, { id: product.id, name: product.name, status: "error", message: `Kayıt hatası: ${updateError.message}` }]);
              setErrorCount((c) => c + 1);
            } else {
              setLogs((prev) => [...prev, { id: product.id, name: product.name, status: "success", message: data.description.slice(0, 80) + "..." }]);
              setSuccessCount((c) => c + 1);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") break;
        setLogs((prev) => [...prev, { id: product.id, name: product.name, status: "error", message: "Bağlantı hatası" }]);
        setErrorCount((c) => c + 1);
      }

      setProcessed((p) => p + 1);

      if (i < filteredProducts.length - 1 && !controller.signal.aborted) {
        await sleep(DELAY_BETWEEN_REQUESTS);
      }
    }

    setRunning(false);
    setPaused(false);
    abortRef.current = null;

    if (!controller.signal.aborted) {
      toast({ title: "Toplu işlem tamamlandı" });
      fetchProducts();
    }
  };

  const handlePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    setRunning(false);
    setPaused(false);
    pausedRef.current = false;
    toast({ title: "İşlem iptal edildi" });
  };

  const progress = filteredProducts.length > 0
    ? Math.round((processed / filteredProducts.length) * 100)
    : 0;

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Toplu AI İşlemleri</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Ürünler için toplu AI destekli isim ve açıklama oluşturun.</p>

      {/* Controls */}
      <div className="bg-card border border-border/30 rounded-2xl p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Filtre</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterMode)}
              disabled={running}
              className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10"
            >
              <option value="missing_description">Açıklaması eksik</option>
              <option value="all">Tüm ürünler</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">İşlem</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as Operation)}
              disabled={running}
              className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10"
            >
              <option value="generate_descriptions">Açıklama Oluştur</option>
              <option value="generate_names">İsim Oluştur</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {loading ? "Yükleniyor..." : `${filteredProducts.length} ürün işlenecek`}
          </span>
          <div className="flex items-center gap-2">
            {running ? (
              <>
                <button onClick={handlePause}
                  className="flex items-center gap-2 text-[13px] font-semibold px-5 h-10 rounded-full border border-border hover:bg-accent transition-colors">
                  {paused ? <><Play className="w-4 h-4" /> Devam</> : <><Pause className="w-4 h-4" /> Duraklat</>}
                </button>
                <button onClick={handleCancel}
                  className="flex items-center gap-2 text-[13px] font-semibold px-5 h-10 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                  <Square className="w-4 h-4" /> İptal
                </button>
              </>
            ) : (
              <button onClick={handleStart} disabled={loading || filteredProducts.length === 0}
                className="flex items-center gap-2 bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-5 h-10 rounded-full transition-all duration-200 disabled:opacity-50">
                {operation === "generate_names" ? <Wand2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />} Başlat
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        {(running || processed > 0) && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{processed} / {filteredProducts.length} işlendi</span>
              <div className="flex items-center gap-3">
                <span className="text-green-600">{successCount} başarılı</span>
                {errorCount > 0 && <span className="text-destructive">{errorCount} hata</span>}
                {paused && <span className="text-yellow-600 animate-pulse">Duraklatıldı</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/50 bg-muted/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">İşlem Kayıtları</span>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-border/30">
            {logs.map((entry, i) => (
              <div key={`${entry.id}-${i}`} className="px-5 py-3 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  entry.status === "success" ? "bg-green-500" : entry.status === "error" ? "bg-destructive" : "bg-yellow-500"
                }`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{entry.name}</p>
                  <p className={`text-xs mt-0.5 ${
                    entry.status === "error" ? "text-destructive" : "text-muted-foreground"
                  } line-clamp-2`}>{entry.message}</p>
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBatchAI;
