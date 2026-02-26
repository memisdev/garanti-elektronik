export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <section className="bg-foreground">
        <div className="container mx-auto px-6 pt-[136px] pb-16 md:pt-[152px] md:pb-20">
          <div className="h-4 w-48 bg-primary-foreground/10 rounded mb-5 animate-pulse" />
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-20 bg-primary-foreground/10 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-primary-foreground/10 rounded animate-pulse" />
          </div>
          <div className="h-10 w-3/4 bg-primary-foreground/10 rounded animate-pulse" />
          <div className="h-5 w-32 bg-primary-foreground/10 rounded mt-2 animate-pulse" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="bg-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div className="aspect-square bg-card rounded-2xl border border-border/40 animate-pulse" />
            <div className="space-y-6">
              <div className="h-7 w-48 bg-muted rounded-full animate-pulse" />
              <div className="h-20 bg-card rounded-2xl border border-border/40 animate-pulse" />
              <div className="flex gap-3">
                <div className="flex-1 h-14 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 h-14 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
