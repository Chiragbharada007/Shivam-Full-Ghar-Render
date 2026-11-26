"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FloralVideoCard, FloralCardProduct } from "./FloralVideoCard";

interface VideoCardGridProps {
  products: FloralCardProduct[];
  locale: string;
  showPrices?: boolean;
  sectionTitle?: string;
  sectionSubtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export function VideoCardGrid({
  products,
  locale,
  showPrices = false,
  sectionTitle,
  sectionSubtitle,
  viewAllLink = "/shop",
  viewAllText,
}: VideoCardGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: locale === "gu" ? "બધી ડિઝાઇન" : locale === "hi" ? "सभी डिज़ाइन" : "All Designs" },
    { id: "garlands", label: locale === "gu" ? "રોયલ વરમાળા" : locale === "hi" ? "रॉयल वरमाला" : "Royal Varmalas" },
    { id: "hair-flowers", label: locale === "gu" ? "બ્રાઇડલ વેણી" : locale === "hi" ? "ब्राइडल वेणी" : "Bridal Veni" },
    { id: "car-decoration", label: locale === "gu" ? "કાર ડેકોરેશન" : locale === "hi" ? "कार सजावट" : "Car Decor" },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "garlands") {
      return (
        p.categoryName.toLowerCase().includes("varmala") ||
        p.categoryName.toLowerCase().includes("garland") ||
        p.categoryName.toLowerCase().includes("વરમાળા")
      );
    }
    if (selectedCategory === "hair-flowers") {
      return (
        p.categoryName.toLowerCase().includes("veni") ||
        p.categoryName.toLowerCase().includes("hair") ||
        p.categoryName.toLowerCase().includes("વેણી")
      );
    }
    if (selectedCategory === "car-decoration") {
      return (
        p.categoryName.toLowerCase().includes("car") ||
        p.categoryName.toLowerCase().includes("ગાડી") ||
        p.categoryName.toLowerCase().includes("કાર")
      );
    }
    return true;
  });

  const defaultTitle =
    locale === "gu"
      ? "હેન્ડક્રાફ્ટેડ વેડિંગ ફ્લોરલ ડિઝાઇન્સ"
      : locale === "hi"
      ? "हस्तनिर्मित विवाह पुष्प डिज़ाइन"
      : "Handcrafted Wedding Floral Designs";

  const defaultViewAll =
    locale === "gu" ? "બધી ડિઝાઇન જુઓ →" : locale === "hi" ? "सभी डिज़ाइन देखें →" : "All Templates →";

  return (
    <section className="relative w-full py-16 sm:py-24 bg-transparent text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Part 4: Section Header Row ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/15">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-light text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-light" />
              <span>{locale === "gu" ? "ભાટ સિમરોલી લાઈવ કલેક્શન" : "Live Floral Catalog"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white">
              {sectionTitle || defaultTitle}
            </h2>
            {sectionSubtitle && (
              <p className="mt-2 text-sm sm:text-base text-white/75 max-w-2xl font-sans">
                {sectionSubtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}${viewAllLink}`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 hover:text-white transition-colors"
            >
              <span>{viewAllText || defaultViewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Filter Pills with Horizontal Touch Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto py-5 no-scrollbar touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-white text-zinc-900 font-semibold shadow-md scale-102"
                  : "bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ─── Part 5 & 6: 4-Column Responsive Grid with Touch/Mouse 3D Cards ─── */}
        <div className="relative pt-2 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <FloralVideoCard
                key={prod.code}
                product={prod}
                locale={locale}
                showPrices={showPrices}
              />
            ))}
          </div>

          {/* ─── Part 7: Dynamic Fade-Out Blur Mask at Bottom ─── */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-48 sm:h-64 bg-gradient-to-t from-black/60 via-black/25 to-transparent backdrop-blur-[1px] transition-colors duration-300" />

          {/* ─── Part 8: Centered Floating CTA Pill ─── */}
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full btn-brand text-sm font-semibold shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-white/20 hover:scale-105 active:scale-95 transition-all group"
            >
              <Sparkles className="w-4 h-4 text-brand-primary fill-rose-500 group-hover:rotate-12 transition-transform" />
              <span>
                {locale === "gu"
                  ? "બધી ડિઝાઇન એક્સપ્લોર કરો"
                  : locale === "hi"
                  ? "सभी डिज़ाइन एक्सप्लोर करें"
                  : "Explore All Templates"}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
