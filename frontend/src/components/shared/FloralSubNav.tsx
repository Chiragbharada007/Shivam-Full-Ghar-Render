"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Sparkles, HeartHandshake, Car, Scissors, Gem, Gift, Image as ImageIcon, MapPin, Search } from "lucide-react";

export function FloralSubNav() {
  const locale = useLocale();
  const pathname = usePathname();

  const categories = [
    {
      slug: "garlands",
      href: `/${locale}/shop?category=garlands`,
      icon: "🌸",
      label: locale === "gu" ? "લગ્ન વરમાળા" : locale === "hi" ? "विवाह वरमाला" : "Wedding Garlands",
      badge: "Popular",
    },
    {
      slug: "car-decoration",
      href: `/${locale}/shop?category=car-decoration`,
      icon: "🚗",
      label: locale === "gu" ? "કાર સજાવટ" : locale === "hi" ? "कार सजावट" : "Car Decoration",
    },
    {
      slug: "hair-flowers",
      href: `/${locale}/shop?category=hair-flowers`,
      icon: "🌺",
      label: locale === "gu" ? "બ્રાઈડલ વેણી" : locale === "hi" ? "ब्राइडल वेणी" : "Bridal Hair Veni",
    },
    {
      slug: "gajra",
      href: `/${locale}/shop?category=gajra`,
      icon: "🌼",
      label: locale === "gu" ? "મદુરાઈ ગજરા" : locale === "hi" ? "मदुरै गजरा" : "Fresh Mogra Gajra",
      badge: "Fresh 5 AM",
    },
    {
      slug: "floral-jewellery",
      href: `/${locale}/shop?category=floral-jewellery`,
      icon: "👑",
      label: locale === "gu" ? "ફૂલોના ઘરેણાં" : locale === "hi" ? "फूलों के गहने" : "Floral Jewellery",
    },
    {
      slug: "packages",
      href: `/${locale}/packages`,
      icon: "🎁",
      label: locale === "gu" ? "લગ્ન પેકેજ" : locale === "hi" ? "विवाह पैकेज" : "Curated Packages",
    },
    {
      slug: "gallery",
      href: `/${locale}/gallery`,
      icon: "📸",
      label: locale === "gu" ? "ગેલેરી" : locale === "hi" ? "गैलरी" : "Real Weddings",
    },
    {
      slug: "location",
      href: `/${locale}/contact`,
      icon: "📍",
      label: locale === "gu" ? "ભાટ સિમરોલી શોપ" : locale === "hi" ? "भाट सिमरौली दुकान" : "Bhat Simroli Shop",
    },
    {
      slug: "custom",
      href: `/${locale}/custom-design`,
      icon: "✨",
      label: locale === "gu" ? "કસ્ટમ ઓર્ડર" : locale === "hi" ? "कस्टम ऑर्डर" : "Custom Inquiry",
    },
  ];

  return (
    <div className="border-t border-stone-200/60 dark:border-white/10 bg-[#faf9f6]/95 dark:bg-[#060606]/95 backdrop-blur-md hidden md:block transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-medium">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {categories.map((item) => {
              const isActive = pathname.includes(item.slug);
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap group ${
                    isActive
                      ? "bg-brand-deep text-white font-semibold shadow-xs"
                      : "text-stone-700 dark:text-zinc-300 hover:text-brand-deep dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 uppercase tracking-tighter border border-amber-300/40 dark:border-amber-700/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="shrink-0 flex items-center gap-2 text-stone-500 dark:text-zinc-400 pl-4 border-l border-stone-200/60 dark:border-white/10">
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-800 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              {locale === "gu" ? "ભાટ સિમરોલી તાજા ફૂલ સ્ટોક લાઈવ" : "Fresh Morning Plucked"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
