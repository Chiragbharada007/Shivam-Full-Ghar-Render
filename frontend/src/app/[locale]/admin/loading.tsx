// src/app/[locale]/admin/loading.tsx
import { Flower2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-14 h-14 rounded-full border-2 border-rose-500/20 animate-ping [animation-duration:2s]" />
        <div className="w-11 h-11 rounded-full bg-stone-100 dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shadow-sm">
          <Flower2 className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-spin [animation-duration:1.8s]" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-xs font-serif font-bold text-stone-800 dark:text-stone-200 tracking-wider uppercase">
          Shivam Full Ghar Admin
        </p>
        <p className="text-[10px] text-stone-500 dark:text-stone-400">
          Loading console data...
        </p>
      </div>
    </div>
  );
}
