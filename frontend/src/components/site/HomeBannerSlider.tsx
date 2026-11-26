"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from "lucide-react";
import { HomeBanner } from "@/lib/banners";

interface HomeBannerSliderProps {
  banners: HomeBanner[];
  locale: string;
}

export function HomeBannerSlider({ banners, locale }: HomeBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeBanners = banners && banners.length > 0 ? banners : [];
  const currentLocale = (locale === "hi" || locale === "en" ? locale : "gu") as "gu" | "hi" | "en";

  const nextSlide = useCallback(() => {
    if (activeBanners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    if (activeBanners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isPaused || activeBanners.length <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];
  const title = current.title[currentLocale] || current.title.en || current.title.gu;
  const subtitle = current.subtitle[currentLocale] || current.subtitle.en || current.subtitle.gu;
  const badge = current.badge?.[currentLocale] || current.badge?.en || current.badge?.gu || "🌸 Special";
  const ctaText = current.ctaText?.[currentLocale] || current.ctaText?.en || (currentLocale === "gu" ? "કલેક્શન જુઓ" : "Explore Now");

  // Ensure link includes locale prefix if not external
  const formattedLink = current.linkUrl.startsWith("http")
    ? current.linkUrl
    : current.linkUrl.startsWith(`/${locale}`)
    ? current.linkUrl
    : `/${locale}${current.linkUrl.startsWith("/") ? "" : "/"}${current.linkUrl}`;

  return (
    <section
      aria-label="Promotional Banners"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/15 bg-stone-900 shadow-2xl min-h-[360px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[520px] flex items-center">
        {/* Desktop Image */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src={current.desktopImage}
            alt={title}
            fill
            priority
            className="object-cover object-center transition-all duration-700 ease-out"
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
        </div>

        {/* Mobile-Optimized Separate Image */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src={current.mobileImage || current.desktopImage}
            alt={title}
            fill
            priority
            className="object-cover object-center transition-all duration-700 ease-out"
            sizes="100vw"
          />
        </div>

        {/* Luxury Radial & Dark Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />

        {/* Slide Content */}
        <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl text-left space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface backdrop-blur-md border border-brand/30 text-rose-300 text-xs sm:text-sm font-bold tracking-wide shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span>{badge}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-[1.15] drop-shadow-md animate-in fade-in slide-in-from-bottom-3 duration-300">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-sans leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none drop-shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
            {subtitle}
          </p>

          {/* Call to Action Button */}
          <div className="pt-2 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <Link
              href={formattedLink}
              className="px-6 sm:px-8 py-3 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(217,119,6,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Direct WhatsApp Quick Enquiry for Banner */}
            <a
              href={`https://wa.me/919824132014?text=${encodeURIComponent(
                `Hello Shivam Full Ghar, I am inquiring about: ${title}. Please share catalogue & booking details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Carousel Navigation Arrow Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Banner"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Banner"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-110 active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Dots & Pause Indicator */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-8 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="text-zinc-400 hover:text-white transition-colors mr-1 cursor-pointer"
              aria-label={isPaused ? "Play slider" : "Pause slider"}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>

            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? "w-6 h-2 bg-amber-400 shadow-sm"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
