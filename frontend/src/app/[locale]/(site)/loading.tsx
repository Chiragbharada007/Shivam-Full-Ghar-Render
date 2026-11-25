// src/app/[locale]/(site)/loading.tsx
import { Flower2 } from "lucide-react";
import { PageDetailSkeleton } from "@/components/shared/Skeleton";

export default function GlobalSiteLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf9f6] dark:bg-[#060606] px-4 py-16 space-y-6">
      {/* Floral Loading Icon */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-2 border-rose-500/20 animate-ping [animation-duration:2.2s]" />
          <div className="w-12 h-12 rounded-full bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shadow-md">
            <Flower2 className="w-6 h-6 text-rose-600 dark:text-rose-400 animate-spin [animation-duration:2s]" />
          </div>
        </div>
        <p className="text-xs font-serif font-bold tracking-widest text-stone-700 dark:text-stone-300 uppercase">
          Loading Fresh Florals...
        </p>
      </div>

      {/* Structured Content Placeholder */}
      <div className="w-full max-w-4xl opacity-60">
        <PageDetailSkeleton />
      </div>
    </div>
  );
}
