// src/components/shared/Skeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 overflow-hidden flex flex-col animate-pulse shadow-xs">
      {/* Image box skeleton */}
      <div className="aspect-4/5 bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden" />

      {/* Body skeleton */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category tag */}
          <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          {/* Title */}
          <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          {/* Subtitle */}
          <div className="h-3 w-3/5 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <div className="h-9 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryTileSkeleton() {
  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-stone-100 dark:bg-[#0d0d0d] border border-black/10 dark:border-white/10 flex items-center gap-3.5 animate-pulse">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-2.5 w-16 bg-zinc-100 dark:bg-zinc-850 rounded-md" />
      </div>
    </div>
  );
}

export function PageDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-850 rounded-md" />
      <div className="aspect-21/9 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
      <div className="space-y-3 pt-6">
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      </div>
    </div>
  );
}
