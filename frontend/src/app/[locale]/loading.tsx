// src/app/[locale]/loading.tsx
import { Flower2 } from "lucide-react";

export default function RootLocaleLoading() {
  return (
    <div
      role="status"
      aria-label="Loading Shivam Full Ghar"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf9f6]/95 dark:bg-[#060606]/95 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated pulsating outer ring */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-rose-500/20 animate-ping [animation-duration:2s]" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-dashed border-rose-500/40 animate-spin [animation-duration:4s]" />

        {/* Center spinning floral icon */}
        <div className="w-12 h-12 rounded-full bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shadow-lg shadow-rose-950/20">
          <Flower2 className="w-6 h-6 text-rose-600 dark:text-rose-400 animate-spin [animation-duration:2.5s]" />
        </div>
      </div>

      <div className="mt-5 text-center space-y-1">
        <p className="text-xs font-serif font-bold tracking-widest text-stone-800 dark:text-stone-200 uppercase">
          Shivam Full Ghar
        </p>
        <p className="text-[10px] text-stone-500 dark:text-stone-400 font-sans tracking-widest uppercase">
          ભાટ સિમરોલી • Fresh Florals Loading...
        </p>
      </div>
    </div>
  );
}
