"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  Star,
  MessageCircle,
  RotateCw,
  Clock,
  ShieldCheck,
  Check,
  Heart,
  Flower2,
  FileText,
} from "lucide-react";
import { formatPrice, getPriceDisplay } from "@/lib/utils";
import { getOptimizedImage } from "@/lib/image-optimizer";

export interface FloralCardProduct {
  code: string;
  name: string;
  price: number;
  mrp?: number;
  categoryName: string;
  image: string;
  videoUrl?: string;
  rating?: number;
  reviewsCount?: number;
  tag?: string;
  isNew?: boolean;
  flowersUsed?: string;
  prepDays?: number;
}

export function FloralVideoCard({
  product,
  locale,
  showPrices = false,
}: {
  product: FloralCardProduct;
  locale: string;
  showPrices?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50 });

  // Mouse & Touch 3D Tilt calculation (only when not flipped)
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width; // 0 to 1
    const y = (clientY - rect.top) / rect.height; // 0 to 1

    const rotateX = (0.5 - y) * 14; // max 7 deg tilt
    const rotateY = (x - 0.5) * 14;

    setTilt({
      rotateX,
      rotateY,
      spotX: Math.round(x * 100),
      spotY: Math.round(y * 100),
    });
  }, [isFlipped]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !isFlipped) {
      videoRef.current.play().catch(() => null);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50 });
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const onTouchEnd = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50 });
  };

  const toggleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = `Hello Shivam Full Ghar Bhat Simroli, I want to enquire about ${product.name} (Code: ${product.code}). Please share availability and details.`;
    window.open(`https://wa.me/919824132014?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const flowersText =
    product.flowersUsed ||
    (locale === "gu"
      ? "૧૦૦% તાજા ડચ ગુલાબ, મદુરાઈ મોગરા કળીઓ અને ગોલ્ડન મોતી લડીઓ"
      : locale === "hi"
      ? "100% ताजे डच गुलाब, मदुरै मोगरा कलियां और सुनहरे मोती"
      : "100% Fresh Dutch Red Roses, Madurai Mogra Buds & Golden Pearls");

  const prepTime = product.prepDays || 2;

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={onMouseMove}
      onTouchStart={() => setIsHovered(true)}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ perspective: "1200px" }}
      className="relative w-full h-[470px] select-none"
    >
      {/* ─── 3D Flippable Card Shell ─── */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped
            ? "rotateY(180deg)"
            : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: isFlipped
            ? "transform 0.75s cubic-bezier(0.34, 1.45, 0.64, 1)"
            : isHovered
            ? "transform 0.12s ease-out"
            : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="relative w-full h-full rounded-2xl transition-all duration-300"
      >
        {/* ======================================================== */}
        {/* ─── CARD FRONT FACE ─── */}
        {/* ======================================================== */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 flex flex-col rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 overflow-hidden shadow-md hover:shadow-2xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_35px_rgba(244,63,94,0.22)] transition-colors duration-300"
        >
          {/* Dynamic Cursor / Touch Radial Spotlight */}
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
            style={{
              background: `radial-gradient(circle 180px at ${tilt.spotX}% ${tilt.spotY}%, rgba(244, 63, 94, 0.18), transparent 70%)`,
            }}
          />

          {/* ── Visual Media Container ── */}
          <div className="relative w-full h-[270px] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
            {/* Actual Video (if provided) */}
            {product.videoUrl ? (
              <video
                ref={videoRef}
                src={product.videoUrl}
                poster={product.image}
                muted
                loop
                playsInline
                preload="none"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={getOptimizedImage(product.image, "thumb").src}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={getOptimizedImage(product.image, "thumb").blurDataUrl}
                  className={`object-cover transition-transform duration-700 ease-out ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                  loading="lazy"
                />

                {/* Subtle vignette overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${
                    isHovered ? "opacity-40" : "opacity-75"
                  }`}
                />

                {/* Glowing Rose Shimmer */}
                <div
                  className={`absolute inset-0 bg-rose-500/10 mix-blend-overlay pointer-events-none transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            )}

            {/* Badges on Top-Left */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
              <span className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                {product.tag || "★ New"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-semibold shadow-xs">
                🌿 5 AM Fresh
              </span>
            </div>

            {/* 3D Flip Button on Top-Right */}
            <button
              type="button"
              onClick={toggleFlip}
              aria-label="Flip card for details"
              title="Flip Card for Flower Details 🔄"
              className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/65 hover:bg-rose-600 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium tracking-tight flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCw className="w-3 h-3 text-rose-300 group-hover:rotate-180 transition-transform" />
              <span>{locale === "gu" ? "વિગતો 🔄" : "Flip 🔄"}</span>
            </button>

            {/* Quick Action Pills on Bottom-Right */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
              {/* WhatsApp Florist Direct Pill */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                aria-label="Enquire via WhatsApp"
                title="Chat with Florist on WhatsApp"
                className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-500" />
              </button>

              {/* Request Quote Pill */}
              <Link
                href={`/${locale}/custom-design?code=${product.code}`}
                aria-label="Request Quote"
                title="Request a Custom Quote"
                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-rose-500 hover:text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500 hover:text-white" />
              </Link>
            </div>
          </div>

          {/* ── Metadata & Price Details ── */}
          <div className="p-4 flex-1 flex flex-col justify-between gap-2 bg-white dark:bg-[#0c0c0c] transition-colors">
            <div>
              {/* Category & Star Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 text-[11px]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{product.rating || 4.9}</span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px]">({product.reviewsCount || 24})</span>
                </div>
              </div>

              {/* Product Title */}
              <Link
                href={`/${locale}/product/${product.code}`}
                className="block mt-1 font-serif font-bold text-zinc-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-300 text-sm sm:text-base leading-snug line-clamp-1 transition-colors"
              >
                {product.name}
              </Link>

              {/* Subtle Flower Summary */}
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                {flowersText}
              </p>
            </div>

            {/* Price & View Link */}
            <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10">
              <div className="flex items-baseline gap-2">
                <span className={`font-bold ${showPrices ? "text-base sm:text-lg text-zinc-900 dark:text-white font-serif" : "text-xs font-medium text-emerald-600 dark:text-emerald-400 font-sans"}`}>
                  {getPriceDisplay(product.price, Boolean(showPrices), (locale as any) || "gu")}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleFlip}
                className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold cursor-pointer"
              >
                <span>{locale === "gu" ? "વિગતો" : "Details"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ─── CARD BACK FACE (REVEALED ON 3D FLIP) ─── */}
        {/* ======================================================== */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 flex flex-col justify-between p-5 rounded-2xl bg-[#faf9f6] dark:bg-[#0d0d0d] border border-rose-500/30 dark:border-rose-500/40 shadow-2xl text-zinc-900 dark:text-zinc-100 overflow-hidden"
        >
          {/* Subtle floral watermark / background tint */}
          <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-rose-500/5 blur-2xl pointer-events-none" />

          {/* Top Bar: Code + Flip Back Button */}
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-300 text-[10px] font-mono font-bold">
                {product.code}
              </span>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                {product.categoryName}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleFlip}
              className="px-2.5 py-1 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Flip back to front"
            >
              <RotateCw className="w-3 h-3 text-rose-500" />
              <span>{locale === "gu" ? "પાછા જાઓ" : "Front"}</span>
            </button>
          </div>

          {/* Core Floral Specifications */}
          <div className="space-y-3.5 my-auto">
            <h4 className="font-serif font-bold text-base text-zinc-900 dark:text-white leading-tight">
              {product.name}
            </h4>

            {/* Floral Ingredients */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Flower2 className="w-3.5 h-3.5" />
                <span>{locale === "gu" ? "તાજા ફૂલોનું મિશ્રણ" : "Fresh Flower Ingredients"}</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed bg-white dark:bg-white/5 p-2 rounded-xl border border-black/5 dark:border-white/10">
                {flowersText}
              </p>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-0.5">
                <span className="text-zinc-400 block">{locale === "gu" ? "કારીગરી સમય" : "Hand-string Prep"}</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {prepTime} {locale === "gu" ? "દિવસ અગાઉ" : "Days Prior"}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-0.5">
                <span className="text-zinc-400 block">{locale === "gu" ? "તાજગી ગેરંટી" : "Harvest Time"}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  5:00 AM Dawn
                </span>
              </div>
            </div>

            {/* Bhat Simroli Pickup Notice */}
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{locale === "gu" ? "ભાટ સિમરોલી દુકાનેથી ફ્રી પિકઅપ ઉપલબ્ધ" : "Free pickup at Bhat Simroli Boutique"}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
            {/* Direct WhatsApp Enquiry */}
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
              <span>
                {locale === "gu"
                  ? "વોટ્સએપ પર પૂછપરછ કરો"
                  : locale === "hi"
                  ? "व्हाट्सएप पर पूछताछ करें"
                  : "Enquire on WhatsApp"}
              </span>
            </button>

            {/* Request Quote & Details Row */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/${locale}/custom-design?code=${product.code}`}
                className="py-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>{locale === "gu" ? "ભાવ મેળવો" : locale === "hi" ? "कोटेशन मांगें" : "Request Quote"}</span>
              </Link>

              <Link
                href={`/${locale}/product/${product.code}`}
                className="py-2 rounded-xl bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <span>{locale === "gu" ? "સંપૂર્ણ પેજ" : "View Details"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}