export default function AdminPanelLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-48 bg-muted rounded-lg" />
        <div className="h-11 w-40 bg-muted rounded-full" />
      </div>
      <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
        <div className="border-b border-border/50 bg-muted/50 px-5 py-3.5">
          <div className="h-3 w-24 bg-muted-foreground/10 rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-b border-border/30 last:border-b-0"
          >
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
