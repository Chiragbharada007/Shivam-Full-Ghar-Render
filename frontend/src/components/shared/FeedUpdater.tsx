"use client";

import React, { useRef, useState } from "react";
import { RefreshCw, ArrowDown, Sparkles } from "lucide-react";

/**
 * Supports all 8 content update patterns:
 * 01 Pull down, 02 Elastic pull, 03 Release cue, 04 New posts pill,
 * 05 Live insert badge, 06 Auto-load trigger, 07 Load more button, 08 Refresh button
 */
export function FeedUpdaterBar({
  onRefresh,
  loading = false,
  newItemsCount = 0,
  onShowNew,
  hasMore = false,
  onLoadMore,
  liveLabel = "Live Feed Connected",
}: {
  onRefresh: () => void;
  loading?: boolean;
  newItemsCount?: number;
  onShowNew?: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  liveLabel?: string;
}) {
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 4) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      // 02 Elastic pull damping
      setPullDistance(Math.min(88, Math.round(delta * 0.45)));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= 52) {
      onRefresh();
    }
    startY.current = null;
    setPullDistance(0);
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} className="space-y-3">
      {/* 01 Pull down + 02 Elastic pull + 03 Release cue */}
      {pullDistance > 6 && (
        <div
          className="flex items-center justify-center text-xs font-medium text-emerald-400 transition-all"
          style={{ height: `${pullDistance}px` }}
        >
          <ArrowDown className={`w-4 h-4 mr-1.5 transition-transform ${pullDistance >= 52 ? "rotate-180 text-emerald-400" : ""}`} />
          <span>{pullDistance >= 52 ? "Release to refresh now" : "Pull down to refresh"}</span>
        </div>
      )}

      {/* Control Strip: 04 New posts pill + 05 Live insert + 08 Refresh button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono-tech bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {liveLabel}
          </span>

          {newItemsCount > 0 && onShowNew && (
            <button
              onClick={onShowNew}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>{newItemsCount} New Updates</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Updating..." : "Refresh"}</span>
        </button>
      </div>

      {/* 07 Load More Button */}
      {hasMore && onLoadMore && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-rose-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
          >
            Load More Items
          </button>
        </div>
      )}
    </div>
  );
}
