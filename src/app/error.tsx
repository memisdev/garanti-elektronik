"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-destructive/20 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-black text-primary-foreground mb-3">
          Bir hata oluştu
        </h1>
        <p className="text-sm text-primary-foreground/40 mb-8 leading-relaxed">
          Beklenmeyen bir sorun meydana geldi. Sayfayı yenileyerek tekrar
          deneyebilirsiniz.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-accent text-accent-foreground font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm"
          >
            Sayfayı Yenile
          </button>
          <a
            href="/"
            className="border border-primary-foreground/15 text-primary-foreground/60 hover:text-primary-foreground font-medium px-6 py-3 rounded-lg transition-all text-sm"
          >
            Ana Sayfa
          </a>
        </div>
      </div>
    </div>
  );
}
