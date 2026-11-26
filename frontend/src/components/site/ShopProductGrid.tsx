"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Sparkles,
  MessageCircle,
  FileText,
  ArrowRight,
  Check,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Heart,
  ChevronRight,
} from "lucide-react";
import { ProductCatalogItem } from "@/lib/catalog";
import { StoreCategory } from "@/lib/categories";
import { formatPrice, getPriceDisplay } from "@/lib/utils";
import { SmartImage } from "@/components/shared/SmartImage";
import { getOptimizedImage } from "@/lib/image-optimizer";

interface ShopProductGridProps {
  products: ProductCatalogItem[];
  categories?: StoreCategory[];
  initialCategory?: string;
  initialColour?: string;
  initialSort?: string;
  initialSearch?: string;
  showPrices?: boolean;
}

export function ShopProductGrid({
  products,
  categories,
  initialCategory,
  initialColour,
  initialSort,
  initialSearch,
  showPrices = false,
}: ShopProductGridProps) {
  const locale = (useLocale() || "gu") as "gu" | "hi" | "en";
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  );
  const [selectedColour, setSelectedColour] = useState<string>(
    initialColour || "all"
  );
  const [selectedSort, setSelectedSort] = useState<string>(
    initialSort || "bestseller"
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || "");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, selectedColour, selectedSort, searchQuery]);

  // Dynamic Category definitions from PostgreSQL database (P8-T18)
  const categoriesList = useMemo(() => {
    const allOption = {
      id: "all",
      label: locale === "gu" ? "બધી પ્રોડક્ટ્સ" : locale === "hi" ? "सभी उत्पाद" : "All Products",
      icon: "/products/hero-wedding.jpg",
      count: products.length,
    };

    if (!categories || categories.length === 0) {
      return [
        allOption,
        {
          id: "garlands",
          label: locale === "gu" ? "લગ્ન વરમાળા" : locale === "hi" ? "विवाह वरमाला" : "Wedding Garlands",
          icon: "/products/VM-R01.jpg",
          count: products.filter((p) => p.category === "garlands").length,
        },
        {
          id: "car-decoration",
          label: locale === "gu" ? "કાર સજાવટ" : locale === "hi" ? "कार सजावट" : "Car Decoration",
          icon: "/products/CR-01.jpg",
          count: products.filter((p) => p.category === "car-decoration").length,
        },
        {
          id: "hair-flowers",
          label: locale === "gu" ? "બ્રાઈડલ વેણી" : locale === "hi" ? "ब्राइडल वेणी" : "Hair Flowers",
          icon: "/products/HF-01.jpg",
          count: products.filter((p) => p.category === "hair-flowers").length,
        },
        {
          id: "gajra",
          label: locale === "gu" ? "મદુરાઈ ગજરા" : locale === "hi" ? "मदुरै गजरा" : "Mogra Gajra",
          icon: "/products/GJ-01.jpg",
          count: products.filter((p) => p.category === "gajra").length,
        },
        {
          id: "floral-jewellery",
          label: locale === "gu" ? "ફૂલોના ઘરેણાં" : locale === "hi" ? "फूलों के गहने" : "Floral Jewellery",
          icon: "/products/FJ-01.jpg",
          count: products.filter((p) => p.category === "floral-jewellery").length,
        },
      ];
    }

    const dynamicItems = categories.map((c) => ({
      id: c.slug,
      label: c.name[locale] || c.name.en || c.name.gu,
      icon: c.coverImage || "/products/VM-R01.jpg",
      count: products.filter((p) => p.category === c.slug).length,
    }));

    return [allOption, ...dynamicItems];
  }, [categories, products, locale]);

  const colourPills = [
    { id: "all", label: locale === "gu" ? "બધા રંગ" : locale === "hi" ? "सभी रंग" : "All Colours", hex: "transparent" },
    { id: "red", label: locale === "gu" ? "લાલ" : "Red", hex: "#DC143C" },
    { id: "yellow", label: locale === "gu" ? "પીળો" : "Yellow", hex: "#EAB308" },
    { id: "white", label: locale === "gu" ? "સફેદ" : "White", hex: "#FFFFFF", border: true },
    { id: "pink", label: locale === "gu" ? "ગુલાબી" : "Pink", hex: "#EC4899" },
    { id: "purple", label: locale === "gu" ? "જાંબલી" : "Purple", hex: "#A855F7" },
    { id: "multicolour", label: locale === "gu" ? "બહુરંગી" : "Multicolour", gradient: true },
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }
        if (selectedColour !== "all" && p.colour !== selectedColour) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchCode = p.code.toLowerCase().includes(q);
          const matchName =
            p.name.gu.toLowerCase().includes(q) ||
            p.name.hi.toLowerCase().includes(q) ||
            p.name.en.toLowerCase().includes(q);
          const matchCat =
            p.category.toLowerCase().includes(q) ||
            p.categoryName.gu.toLowerCase().includes(q) ||
            p.categoryName.hi.toLowerCase().includes(q) ||
            p.categoryName.en.toLowerCase().includes(q);
          const matchFlowers =
            (p.flowersUsed?.en && p.flowersUsed.en.toLowerCase().includes(q)) ||
            (p.flowersUsed?.gu && p.flowersUsed.gu.toLowerCase().includes(q)) ||
            (p.flowersUsed?.hi && p.flowersUsed.hi.toLowerCase().includes(q));
          const matchDesc =
            (p.description?.en && p.description.en.toLowerCase().includes(q)) ||
            (p.description?.gu && p.description.gu.toLowerCase().includes(q)) ||
            (p.description?.hi && p.description.hi.toLowerCase().includes(q));

          // Phonetic & transliteration checks
          const isVarmalaQuery = /varmala|jaimala|garland|વરમાળા|वरमाला/.test(q);
          const isVarmalaProd =
            p.category === "garlands" || /varmala|garland|વરમાળા|वरमाला/i.test(p.name.en + p.name.gu);

          const isVeniQuery = /veni|hair|choti|વેણી|वेणी/.test(q);
          const isVeniProd =
            p.category === "hair-flowers" || /veni|hair/i.test(p.name.en + p.name.gu);

          const isMograQuery = /mogra|gajra|jasmine|મોગરા|ગજરા|मोगरा|गजरा/.test(q);
          const isMograProd =
            p.category === "gajra" ||
            /mogra|gajra|jasmine/i.test(p.name.en + p.name.gu + (p.flowersUsed?.en || ""));

          const isCarQuery = /car|gaadi|gadi|decor|કાર|ગાડી|गाड़ी/.test(q);
          const isCarProd = p.category === "car-decoration";

          const isJewelQuery = /jewel|gehna|gharena|haldi|ઘરેણાં|ગહેને|हल्दी/.test(q);
          const isJewelProd = p.category === "floral-jewellery";

          const isRoseQuery = /rose|gulab|લાલ|ગુલાબ|गुलाब|लाल/.test(q);
          const isRoseProd = /rose|gulab|red|લાલ|ગુલાબ|गुलाब/i.test(
            p.name.en + p.name.gu + (p.flowersUsed?.en || "") + p.colour
          );

          const matchesPhonetic =
            (isVarmalaQuery && isVarmalaProd) ||
            (isVeniQuery && isVeniProd) ||
            (isMograQuery && isMograProd) ||
            (isCarQuery && isCarProd) ||
            (isJewelQuery && isJewelProd) ||
            (isRoseQuery && isRoseProd);

          if (!matchName && !matchCode && !matchCat && !matchFlowers && !matchDesc && !matchesPhonetic) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-asc") return a.price - b.price;
        if (selectedSort === "price-desc") return b.price - a.price;
        if (selectedSort === "prep-asc") return a.prepDays - b.prepDays;
        if (selectedSort === "rating") return b.rating - a.rating;
        // default: bestsellers first
        if (a.bestseller && !b.bestseller) return -1;
        if (!a.bestseller && b.bestseller) return 1;
        return 0;
      });
  }, [products, selectedCategory, selectedColour, selectedSort, searchQuery]);

  return (
    <div className="space-y-10">
      {/* ── BHAT SIMROLI BOUTIQUE FRESH PICKUP BANNER ── */}
      <div className="rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 transition-colors">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand/30 flex items-center justify-center text-brand-primary dark:text-brand-primary shrink-0 text-xl">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary dark:text-brand-primary">
                {locale === "gu" ? "ભાટ સિમરોલી શોપ તાજા ફૂલો પિકઅપ" : locale === "hi" ? "भाट सिमरौली दुकान ताजे फूल पिकअप" : "Fresh Store Pickup in Bhat Simroli"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                ✓ 100% Fresh Daily
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 font-sans">
              {locale === "gu"
                ? "ઓર્ડર આપ્યા બાદ શિવમ ફૂલ ઘર ભાટ સિમરોલી દુકાનેથી સીધું મેળવો • દરરોજ સવારે ૮:૦૦ થી રાત્રે ૮:૦૦"
                : locale === "hi"
                ? "ऑर्डर देने के बाद शिवम फूल घर भाट सिमरौली दुकान से सीधा प्राप्त करें • प्रतिदिन सुबह 8:00 से रात 8:00"
                : "Handcrafted fresh wedding florals ready for pickup at our Bhat Simroli boutique • Open 8:00 AM – 8:00 PM Everyday"}
            </p>
          </div>
        </div>

        <Link
          href={`/${locale}/contact`}
          className="px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-semibold text-zinc-800 dark:text-white transition-colors shrink-0 flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 text-amber-500" />
          <span>{locale === "gu" ? "દુકાન સરનામું જુઓ" : "View Shop Location"}</span>
        </Link>
      </div>

      {/* ── FLORALHUB-STYLE VISUAL CATEGORY BUBBLE SLIDER ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white">
            {locale === "gu" ? "કેટેગરી પસંદ કરો" : locale === "hi" ? "श्रेणी चुनें" : "Explore Collections"}
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {filteredProducts.length} {locale === "gu" ? "ઉત્પાદનો" : "Items"}
          </span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-3">
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2.5 p-3 rounded-2xl transition-all shrink-0 cursor-pointer text-center group ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg scale-102 font-semibold"
                    : "bg-white dark:bg-[#0c0c0c] hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/10"
                }`}
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-transform duration-300 group-hover:scale-105 relative ${
                    isActive ? "border-brand ring-2 ring-brand" : "border-black/10 dark:border-white/10"
                  }`}
                >
                  <img
                    src={getOptimizedImage(cat.icon, "thumb").src}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-bold block whitespace-nowrap">
                    {cat.label}
                  </span>
                  <span
                    className={`text-[10px] font-medium block ${
                      isActive ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-500"
                    }`}
                  >
                    {cat.count} {locale === "gu" ? "ડિઝાઇન" : "Designs"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS BAR ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xl space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                locale === "gu"
                  ? "વરમાળા, કાર શણગાર, વેણી, ગજરા શોધો..."
                  : locale === "hi"
                  ? "वरमाला, कार सजावट, वेणी, गजरा खोजें..."
                  : "Search rose varmala, car decor, bridal veni, mogra gajra..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:bg-black/10 dark:focus:bg-white/10 focus:border-rose-400 focus:outline-hidden transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-zinc-600 dark:text-zinc-400 font-semibold whitespace-nowrap">
              {locale === "gu" ? "ક્રમ:" : "Sort:"}
            </span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-medium text-zinc-800 dark:text-zinc-200 text-xs focus:ring-2 focus:ring-rose-800 focus:outline-hidden cursor-pointer"
            >
              <option value="bestseller">★ {locale === "gu" ? "સૌથી વધુ લોકપ્રિય" : "Bestsellers"}</option>
              <option value="price-asc">{locale === "gu" ? "કિંમત: ઓછી થી વધુ" : "Price: Low to High"}</option>
              <option value="price-desc">{locale === "gu" ? "કિંમત: વધુ થી ઓછી" : "Price: High to Low"}</option>
              <option value="rating">★ {locale === "gu" ? "ઉચ્ચ રેટિંગ" : "Top Customer Rated"}</option>
              <option value="prep-asc">⚡ {locale === "gu" ? "ઝડપી ૧-દિવસ ડિલિવરી" : "Fastest 1-Day Prep"}</option>
            </select>
          </div>
        </div>

        {/* Colour Filter Pills */}
        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mr-1">
            {locale === "gu" ? "રંગ:" : "Colour:"}
          </span>
          {colourPills.map((c) => {
            const isActive = selectedColour === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedColour(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-brand-primary text-white shadow-xs font-bold ring-2 ring-brand"
                    : "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/10"
                }`}
              >
                {c.hex !== "transparent" && (
                  <span
                    className={`w-2.5 h-2.5 rounded-full inline-block ${
                      c.border ? "border border-zinc-300" : ""
                    } ${c.gradient ? "bg-gradient-to-r from-red-500 via-yellow-400 to-pink-500" : ""}`}
                    style={!c.gradient ? { backgroundColor: c.hex } : {}}
                  />
                )}
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FLORAL PRODUCT GRID ── */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#0c0c0c] rounded-3xl border border-black/10 dark:border-white/10 p-8 space-y-4">
          <span className="text-5xl">🌸</span>
          <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">
            {locale === "gu" ? "કોઈ પ્રોડક્ટ મળી નથી" : "No Floral Items Found"}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            {locale === "gu"
              ? "તમે પસંદ કરેલા ફિલ્ટર સાથે કોઈ પ્રોડક્ટ મળતી નથી. કૃપા કરીને અન્ય કેટેગરી અથવા રંગ અજમાવો."
              : "Try adjusting your category or colour filters to explore our full handcrafted wedding collection."}
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedColour("all");
              setSearchQuery("");
            }}
            className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-medium text-xs shadow-md hover:bg-brand-deep transition-colors cursor-pointer"
          >
            {locale === "gu" ? "બધા ફિલ્ટર્સ સાફ કરો" : "Reset All Filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.slice(0, visibleCount).map((p) => {
            return (
              <div
                key={p.code}
                className="rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 overflow-hidden shadow-md hover:shadow-2xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] dark:hover:border-white/25 hover:scale-[1.01] transition-all duration-300 flex flex-col group relative"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <Link href={`/${locale}/product/${p.code}`} className="block w-full h-full">
                    <SmartImage
                      src={p.image}
                      alt={p.name[locale] || p.name.en}
                      variant="thumb"
                      aspectRatio="auto"
                      className="w-full h-full"
                      imageClassName="group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                  </Link>

                  {/* Gradient overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {p.bestseller && (
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-primary text-white font-bold text-[10px] tracking-wide shadow-md uppercase">
                        ★ Bestseller
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/90 backdrop-blur-xs text-white font-semibold text-[10px] shadow-sm">
                      🌿 5 AM Fresh Plucked
                    </span>
                  </div>

                  {/* Prep Time Badge */}
                  <div className="absolute top-3 right-3 z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-[10px] border border-white/20 shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {p.prepDays} {locale === "gu" ? "દિવસ" : "Days Prep"}
                    </span>
                  </div>

                  {/* Pair Info Banner at bottom of image */}
                  <div className="absolute bottom-2 left-3 right-3 z-10 pointer-events-none">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-xs text-amber-200 text-[10px] font-medium truncate max-w-full">
                      💐 {p.pairInfo[locale] || p.pairInfo.en}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Category & Star Rating */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-brand-primary dark:text-brand-primary uppercase tracking-wider">
                        {p.categoryName[locale] || p.categoryName.en}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{p.rating}</span>
                        <span className="text-zinc-400 dark:text-zinc-500 font-normal">({p.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-serif font-bold text-zinc-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-brand-primary dark:group-hover:text-rose-300 transition-colors">
                      <Link href={`/${locale}/product/${p.code}`}>
                        {p.name[locale] || p.name.en}
                      </Link>
                    </h3>

                    {/* Flower Ingredients */}
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 font-sans">
                      {p.flowersUsed[locale] || p.flowersUsed.en}
                    </p>
                  </div>

                  {/* Pricing Details */}
                  <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className={`font-bold ${showPrices ? "text-xl font-serif text-zinc-900 dark:text-white" : "text-xs font-medium text-emerald-600 dark:text-emerald-400 font-sans"}`}>
                        {getPriceDisplay(p.price, Boolean(showPrices), locale)}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        {p.code}
                      </span>
                    </div>
                  </div>

                  {/* DIRECT ACTION BUTTONS: WhatsApp Enquiry & Request Quote */}
                  <div className="pt-1 grid grid-cols-2 gap-2">
                    {/* Enquire on WhatsApp */}
                    <a
                      href={`https://wa.me/919824132014?text=${encodeURIComponent(
                        `Hello Shivam Full Ghar Bhat Simroli, I am interested in ${p.name[locale] || p.name.en} (Code: ${p.code}). Please share availability and details.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                      <span>{locale === "gu" ? "વોટ્સએપ" : locale === "hi" ? "व्हाट्सएप" : "WhatsApp"}</span>
                    </a>

                    {/* Request a Quote */}
                    <Link
                      href={`/${locale}/custom-design?code=${p.code}`}
                      className="px-3 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-800 dark:text-white border border-black/10 dark:border-white/15 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{locale === "gu" ? "ભાવ મેળવો" : locale === "hi" ? "कोटेशन" : "Quote"}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination / Load More Button (P8-T25) */}
      {filteredProducts.length > visibleCount && (
        <div className="pt-8 flex flex-col items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-8 py-3 rounded-full bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>
              {locale === "gu"
                ? "વધુ પ્રોડક્ટ્સ જુઓ (+૧૨)"
                : locale === "hi"
                ? "और उत्पाद देखें (+12)"
                : "Load More Products (+12)"}
            </span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-[11px] text-zinc-500 font-medium">
            {locale === "gu"
              ? `${Math.min(visibleCount, filteredProducts.length)} / ${filteredProducts.length} પ્રોડક્ટ્સ દર્શાવેલ છે`
              : `Showing ${Math.min(visibleCount, filteredProducts.length)} of ${filteredProducts.length} products`}
          </span>
        </div>
      )}

      {/* ── VALUE PROPS & TRUST SECTION ── */}
      <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand/30 flex items-center justify-center text-brand-primary dark:text-brand-primary shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-zinc-900 dark:text-white text-sm">
              {locale === "gu" ? "૧૦૦% તાજા બગીચાના ફૂલ" : "100% Morning Plucked"}
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Plucked fresh at 5:00 AM on your event morning.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-zinc-900 dark:text-white text-sm">
              Free Pickup at Bhat Simroli
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Freshly boxed with dry ice preservation for longevity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-zinc-900 dark:text-white text-sm">
              40% Advance Payment
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Pay remaining 60% upon pickup at our Bhat Simroli shop.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-zinc-900 dark:text-white text-sm">
              Live Photo Proof
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              WhatsApp photo sent before handover for your peace of mind.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand/30 flex items-center justify-center text-brand-primary dark:text-brand-primary shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-zinc-900 dark:text-white text-sm">
              Pinterest Custom Designs
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              WhatsApp your dream garland photo for 100% replica crafting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
