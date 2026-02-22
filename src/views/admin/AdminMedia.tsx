"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon, Wand2, Check } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata?: { size?: number };
}

const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());
  const [processedFiles, setProcessedFiles] = useState<Set<string>>(new Set());

  const fetchFiles = async () => {
    // List root files
    const { data: rootData } = await supabase.storage.from("product-images").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    const rootFiles = (rootData || []).filter((f) => f.name !== ".emptyFolderPlaceholder");

    // Find subdirectories and list their contents
    const folders = (rootData || []).filter((f) => f.id === null || (f.metadata === null && !f.id));
    const subFiles: MediaFile[] = [];
    for (const folder of folders) {
      const { data: subData } = await supabase.storage.from("product-images").list(folder.name, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      if (subData) {
        for (const sf of subData) {
          if (sf.name !== ".emptyFolderPlaceholder") {
            subFiles.push({ ...sf, name: `${folder.name}/${sf.name}` } as MediaFile);
          }
        }
      }
    }

    const actualRootFiles = rootFiles.filter((f) => f.id !== null && f.metadata !== null);
    const allFiles = [...actualRootFiles, ...subFiles];
    setFiles(allFiles);

    // Check which files have processed versions
    const processedNames = new Set<string>();
    for (const f of allFiles) {
      if (f.name.startsWith("processed/")) {
        // Find the original name this corresponds to
        const origName = f.name.replace("processed/", "").replace(/\.png$/, "");
        // Match against original files (strip extension for comparison)
        for (const of of allFiles) {
          if (!of.name.startsWith("processed/") && of.name.replace(/\.[^.]+$/, "") === origName) {
            processedNames.add(of.name);
          }
        }
      }
    }
    setProcessedFiles(processedNames);
    setLoading(false);
  };

  useEffect(() => { fetchFiles(); }, []);

  const processImage = async (fileName: string) => {
    setProcessingFiles((prev) => new Set(prev).add(fileName));
    try {
      const resp = await fetch("/api/admin/process-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: fileName }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        toast({ title: "Arka plan kaldırma başarısız", description: data.error ?? "Processing failed", variant: "destructive" });
        return;
      }

      if (data?.error) {
        toast({ title: "Arka plan kaldırma başarısız", description: data.error, variant: "destructive" });
        return;
      }

      toast({ title: "Arka plan kaldırıldı", description: "İşlenmiş görsel processed/ klasörüne kaydedildi." });
      setProcessedFiles((prev) => new Set(prev).add(fileName));
      fetchFiles();
    } catch (err) {
      console.error("Process error:", err);
      toast({ title: "Hata oluştu", variant: "destructive" });
    } finally {
      setProcessingFiles((prev) => {
        const next = new Set(prev);
        next.delete(fileName);
        return next;
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setUploading(true);
    const uploadedPaths: string[] = [];
    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (!error) uploadedPaths.push(path);
    }
    setUploading(false);
    toast({ title: "Dosyalar yüklendi" });
    await fetchFiles();

    // Auto-process uploaded images
    for (const path of uploadedPaths) {
      processImage(path);
    }

    e.target.value = "";
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.storage.from("product-images").remove([deleteTarget]);
    // Also try to delete processed version
    const processedPath = `processed/${deleteTarget.replace(/\.[^.]+$/, "")}.png`;
    await supabase.storage.from("product-images").remove([processedPath]);
    toast({ title: "Dosya silindi" });
    setDeleteTarget(null);
    fetchFiles();
  };

  const copyUrl = (name: string) => {
    const { data } = supabase.storage.from("product-images").getPublicUrl(name);
    navigator.clipboard.writeText(data.publicUrl);
    toast({ title: "URL kopyalandı" });
  };

  const getPublicUrl = (name: string) => {
    const { data } = supabase.storage.from("product-images").getPublicUrl(name);
    return data.publicUrl;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filter out processed/ files from the main grid
  const displayFiles = files.filter((f) => !f.name.startsWith("processed/"));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Medya</h1>
        <label className="flex items-center gap-2 bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-5 h-11 rounded-full transition-all duration-200 cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Yükle
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Ürün görsellerini buradan yükleyebilir ve yönetebilirsiniz. Yüklenen görsellerin arka planı otomatik olarak kaldırılır.</p>

      {loading ? <p className="text-sm text-muted-foreground">Yükleniyor...</p> : displayFiles.length === 0 ? (
        <div className="bg-card border border-border/30 rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
          Henüz dosya yüklenmemiş. Görselleri yüklemek için yukarıdaki butona tıklayın.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {displayFiles.map((f) => {
            const isProcessing = processingFiles.has(f.name);
            const hasProcessed = processedFiles.has(f.name);

            return (
              <div key={f.name} className="bg-card border border-border/30 rounded-2xl overflow-hidden group relative">
                {/* Processed badge */}
                {hasProcessed && !isProcessing && (
                  <div className="absolute top-2 left-2 z-10 bg-emerald-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> BG Kaldırıldı
                  </div>
                )}

                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-2xl">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-xs font-medium text-foreground">Arka plan kaldırılıyor...</span>
                  </div>
                )}

                <div className="aspect-square bg-surface relative">
                  <img src={getPublicUrl(f.name)} alt={f.name} className="w-full h-full object-cover" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => copyUrl(f.name)} className="w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center" title="URL Kopyala"><Copy className="w-4 h-4 text-foreground" /></button>
                    {!hasProcessed && !isProcessing && (
                      <button onClick={() => processImage(f.name)} className="w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center" title="Arka Plan Kaldır"><Wand2 className="w-4 h-4 text-foreground" /></button>
                    )}
                    {hasProcessed && (
                      <button onClick={() => {
                        const processedPath = `processed/${f.name.replace(/\.[^.]+$/, "")}.png`;
                        copyUrl(processedPath);
                      }} className="w-9 h-9 rounded-xl bg-emerald-500/90 flex items-center justify-center" title="İşlenmiş URL Kopyala"><Copy className="w-4 h-4 text-white" /></button>
                    )}
                    <button onClick={() => setDeleteTarget(f.name)} className="w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center" title="Sil"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-muted-foreground truncate">{f.name}</p>
                  {f.metadata?.size && <p className="text-[10px] text-muted-foreground/60">{formatSize(f.metadata.size)}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dosyayı Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu dosyayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
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

export default AdminMedia;
