const SkeletonPage = () => (
  <div className="min-h-[60vh] bg-background">
    {/* Hero skeleton */}
    <div className="bg-foreground">
      <div className="container mx-auto px-6 py-20 md:py-28">
        <div className="w-12 h-[3px] bg-primary-foreground/10 rounded mb-5" />
        <div className="w-2/3 max-w-md h-10 bg-primary-foreground/10 rounded-lg mb-3 animate-pulse" />
        <div className="w-1/3 max-w-xs h-10 bg-primary-foreground/10 rounded-lg animate-pulse" />
      </div>
    </div>
    {/* Content skeleton */}
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="aspect-[4/3] bg-muted animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="w-20 h-3 bg-muted rounded animate-pulse" />
              <div className="w-full h-4 bg-muted rounded animate-pulse" />
              <div className="w-2/3 h-4 bg-muted rounded animate-pulse" />
              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
                <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonPage;
