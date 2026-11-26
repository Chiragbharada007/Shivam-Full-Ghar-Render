"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <span className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-[#244C38] hover:bg-[#163526] text-[#FAF7EF] font-semibold text-xs transition-colors">
      <span>{actionLabel}</span>
      <ArrowRight className="w-3.5 h-3.5 text-[#D7B77C]" />
    </span>
  );

  return (
    <article className="p-6 rounded-[28px] bg-white border border-[#244C38]/12 shadow-xs hover:shadow-md transition-all flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-[#F3EFE4]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {priceBadge && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#163526]/90 text-[#FAF7EF] font-mono-tech text-[11px] font-bold">
            {priceBadge}
          </span>
        )}
      </div>

      <div className="space-y-1.5 flex-1">
        <h3 className="font-serif text-xl font-bold text-[#163526] leading-snug line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-[#282A26]/75 leading-relaxed line-clamp-2">
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
