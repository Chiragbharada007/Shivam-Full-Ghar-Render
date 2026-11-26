"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Flower2 } from "lucide-react";

export function GlobalNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or search params change, complete and hide loader
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setShowSpinner(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    let progressInterval: any;
    let spinnerTimer: any;

    const handleAnchorClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, hash anchors, mailto, tel, target="_blank", or download links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        target.getAttribute("target") === "_blank" ||
        target.getAttribute("rel")?.includes("external") ||
        target.hasAttribute("download")
      ) {
        return;
      }

      // If clicked current full path with no hash, skip
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) {
        return;
      }

      // Start navigation indicator
      setIsNavigating(true);
      setProgress(25);

      // Show spinner if loading takes more than 150ms
      spinnerTimer = setTimeout(() => {
        setShowSpinner(true);
      }, 150);

      // Increment progress smoothly
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + (90 - prev) * 0.15;
        });
      }, 200);
    };

    const handlePopState = () => {
      setIsNavigating(true);
      setProgress(40);
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      if (progressInterval) clearInterval(progressInterval);
      if (spinnerTimer) clearTimeout(spinnerTimer);
    };
  }, []);

  if (!isNavigating && progress === 0) {
    return null;
  }

  return (
    <>
      {/* Top glowing progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[99999] h-[3px] bg-transparent pointer-events-none transition-opacity duration-300"
        style={{ opacity: isNavigating ? 1 : 0 }}
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--brand-primary)] via-amber-400 to-rose-500 shadow-[0_0_12px_rgba(225,29,72,0.85)] transition-all ease-out"
          style={{
            width: `${progress}%`,
            transitionDuration: progress === 100 ? "200ms" : "400ms",
          }}
        />
      </div>

      {/* Floating floral loading indicator when loading takes >150ms */}
      {showSpinner && (
        <div
          aria-live="polite"
          aria-label="Loading page"
          className="fixed bottom-6 left-6 z-[99999] pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-stone-900/90 dark:bg-stone-900/95 backdrop-blur-md border border-brand text-white shadow-xl shadow-black/30">
            <Flower2 className="w-4 h-4 text-brand-primary animate-spin [animation-duration:1.2s]" />
            <span className="text-xs font-serif font-medium tracking-wide">
              Loading...
            </span>
          </div>
        </div>
      )}
    </>
  );
}
