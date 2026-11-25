"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * 5-Rule Perfect Card (Emerald Green & Royal Red Theme):
 * 1. 8pt grid spacing (p-6 = 24px, gap-4 = 16px)
 * 2. 24px padding on every side (p-6)
 * 3. Clear hierarchy: Image -> Title -> Details
 * 4. Outer radius = inner radius + padding (rounded-[32px] outer + rounded-[8px] inner)
 * 5. One primary action button
 */
export function PerfectCard({
  image,
  title,
  details,
  priceBadge,
  actionLabel = "View Design",
  href,
  onAction,
}: {
  image: string;
  title: string;
  details: string;
  priceBadge?: string;
  actionLabel?: string;
  href?: string;
  onAction?: () => void;
}) {
  const buttonContent = (
    <span className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white font-geometric font-semibold text-xs transition-all shadow-md">
      <span>{actionLabel}</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </span>
  );

  return (
    <article className="p-6 rounded-[32px] bg-white dark:bg-[#071a13] border border-emerald-500/20 dark:border-emerald-500/25 shadow-sm hover:shadow-xl hover:shadow-emerald-950/20 transition-all flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-zinc-100 dark:bg-zinc-900">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        {priceBadge && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-emerald-950/85 backdrop-blur-md text-emerald-100 font-mono-tech text-[11px] font-bold border border-emerald-400/30">
            {priceBadge}
          </span>
        )}
      </div>

      <div className="space-y-1.5 flex-1">
        <h3 className="font-editorial text-xl font-bold text-zinc-900 dark:text-white leading-snug line-clamp-1">
          {title}
        </h3>
        <p className="font-geometric text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
          {details}
        </p>
      </div>

      {href ? (
        <Link href={href} className="block">
          {buttonContent}
        </Link>
      ) : (
        <button type="button" onClick={onAction} className="w-full">
          {buttonContent}
        </button>
      )}
    </article>
  );
}
