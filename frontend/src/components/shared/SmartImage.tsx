// src/components/shared/SmartImage.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { getOptimizedImage, ImageVariant } from "@/lib/image-optimizer";
import { Flower2 } from "lucide-react";

export interface SmartImageProps {
  src: string | undefined | null;
  alt: string;
  variant?: ImageVariant;
  aspectRatio?: "square" | "portrait" | "video" | "wide" | "auto";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

const ASPECT_MAP = {
  square: "aspect-square",
  portrait: "aspect-4/5",
  video: "aspect-16/9",
  wide: "aspect-21/9",
  auto: "",
};

export function SmartImage({
  src,
  alt,
  variant = "med",
  aspectRatio = "portrait",
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  fill = true,
  width,
  height,
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { src: optimizedSrc, blurDataUrl } = getOptimizedImage(src, variant);
  const aspectClass = ASPECT_MAP[aspectRatio];

  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-rose-50/60 dark:bg-zinc-900 border border-black/5 dark:border-white/10 flex flex-col items-center justify-center text-center p-4 ${aspectClass} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 shadow-xs">
          <Flower2 className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-[11px] font-serif font-bold text-zinc-700 dark:text-zinc-300 line-clamp-2 px-2">
          {alt || "Shivam Full Ghar Fresh Flower"}
        </span>
        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5">
          Bhat Simroli Boutique
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${aspectClass} ${className}`}>
      {/* Skeleton Pulse until loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 animate-pulse z-0" />
      )}

      {fill ? (
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          placeholder="blur"
          blurDataURL={blurDataUrl}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`object-cover w-full h-full transition-all duration-500 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } ${imageClassName}`}
        />
      ) : (
        <Image
          src={optimizedSrc}
          alt={alt}
          width={width || 600}
          height={height || 750}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          placeholder="blur"
          blurDataURL={blurDataUrl}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`object-cover transition-all duration-500 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } ${imageClassName}`}
        />
      )}
    </div>
  );
}
