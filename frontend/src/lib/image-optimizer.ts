// src/lib/image-optimizer.ts
import manifestJson from "./image-manifest.json";

export type ImageVariant = "thumb" | "med" | "full" | "original";

interface ManifestEntry {
  original: string;
  originalBytes: number;
  thumb: string;
  thumbBytes: number;
  med: string;
  medBytes: number;
  full: string;
  fullBytes: number;
  blurDataUrl: string;
  width?: number;
  height?: number;
}

const MANIFEST: Record<string, ManifestEntry> = manifestJson as any;

export const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23f3f4f6'/%3E%3C/svg%3E";

export interface OptimizedImageResult {
  src: string;
  blurDataUrl: string;
  width?: number;
  height?: number;
  isWebP: boolean;
}

/**
 * Returns the optimized WebP image path and blurDataUrl for a given image path
 */
export function getOptimizedImage(
  src: string | undefined | null,
  variant: ImageVariant = "med"
): OptimizedImageResult {
  if (!src) {
    return {
      src: "/products/VM-R01-thumb.webp",
      blurDataUrl: DEFAULT_BLUR_DATA_URL,
      isWebP: true,
    };
  }

  // Pass through data URLs, external HTTPS URLs, and database media endpoints untouched
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/api/media/")) {
    return {
      src,
      blurDataUrl: DEFAULT_BLUR_DATA_URL,
      isWebP: false,
    };
  }

  // Normalize path
  const normalized = src.startsWith("/") ? src : `/${src}`;

  // 1. Direct manifest lookup
  const entry = MANIFEST[normalized];
  if (entry) {
    let chosenSrc = entry.med;
    if (variant === "thumb") chosenSrc = entry.thumb;
    else if (variant === "full") chosenSrc = entry.full;
    else if (variant === "original") chosenSrc = entry.original;

    return {
      src: chosenSrc,
      blurDataUrl: entry.blurDataUrl || DEFAULT_BLUR_DATA_URL,
      width: entry.width,
      height: entry.height,
      isWebP: chosenSrc.endsWith(".webp"),
    };
  }

  // 2. Check if it's already a WebP or SVG
  if (normalized.endsWith(".webp") || normalized.endsWith(".svg")) {
    return {
      src: normalized,
      blurDataUrl: DEFAULT_BLUR_DATA_URL,
      isWebP: normalized.endsWith(".webp"),
    };
  }

  // 3. Heuristic replacement for products/
  if (normalized.includes("/products/") && (normalized.endsWith(".jpg") || normalized.endsWith(".png"))) {
    const base = normalized.replace(/\.(jpg|jpeg|png)$/i, "");
    let webpUrl = `${base}.webp`;
    if (variant === "thumb") webpUrl = `${base}-thumb.webp`;
    else if (variant === "med") webpUrl = `${base}-med.webp`;

    return {
      src: webpUrl,
      blurDataUrl: DEFAULT_BLUR_DATA_URL,
      isWebP: true,
    };
  }

  // 4. Remote URL fallback
  return {
    src: normalized,
    blurDataUrl: DEFAULT_BLUR_DATA_URL,
    isWebP: false,
  };
}
