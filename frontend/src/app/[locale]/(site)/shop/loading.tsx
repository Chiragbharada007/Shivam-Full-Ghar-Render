// src/app/[locale]/(site)/shop/loading.tsx
import { Flower2 } from "lucide-react";
import { ProductGridSkeleton } from "@/components/shared/Skeleton";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#060606] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
        {/* Header Skeleton with Floral Loading Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-stone-900 border border-rose-200 dark:border-rose-900 flex items-center justify-center shrink-0">
            <Flower2 className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-spin" />
          </div>
          <div className="space-y-1.5">
            <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
            <div className="h-3 w-72 bg-zinc-100 dark:bg-zinc-850 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Filter Row Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse shrink-0" />
          ))}
        </div>

        {/* Product Grid Skeleton */}
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
