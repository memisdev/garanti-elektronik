"use client";

export default function AdminPanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-card border border-border/30 rounded-2xl px-8 py-10 max-w-md w-full">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Bir hata olustu
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || "Beklenmeyen bir hata meydana geldi."}
        </p>
        <button
          onClick={reset}
          className="bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-6 h-10 rounded-full transition-all duration-200"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
