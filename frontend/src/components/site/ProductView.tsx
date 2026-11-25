"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Plus,
  Minus,
  Check,
  MessageCircle,
  FileText,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { formatPrice, getPriceDisplay } from "@/lib/utils";
import { SmartImage } from "@/components/shared/SmartImage";

interface ProductViewProps {
  product: {
    id: string;
    code: string;
    name: string;
    description: string;
    basePrice: number; // in rupees
    prepTimeDays: number;
    categoryName: string;
    options: Array<{ id: string; label: string; priceAdd: number }>;
    addOns: Array<{ id: string; label: string; price: number }>;
    image?: string;
  };
  earliestDate: string;
  showPrices?: boolean;
}

export function ProductView({ product, earliestDate, showPrices = false }: ProductViewProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("product");

  const [selectedOption, setSelectedOption] = useState(
    product.options[0]?.id || ""
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [allowSubstitutions, setAllowSubstitutions] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Main image gallery switcher
  const primaryImage = product.image || `/products/${product.code}.jpg`;
  const galleryImages = [
    primaryImage,
    "/products/hero-wedding.jpg",
    "/products/artisan-craft.jpg",
  ];
  const [activeImage, setActiveImage] = useState(primaryImage);

  // Calculate live price
  const currentOption = product.options.find((o) => o.id === selectedOption);
  const optionExtra = currentOption ? currentOption.priceAdd : 0;

  const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
    const item = product.addOns.find((a) => a.id === addOnId);
    return sum + (item ? item.price : 0);
  }, 0);

  const unitPrice = product.basePrice + optionExtra;
  const totalPrice = (unitPrice + addOnsTotal) * quantity;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start text-zinc-900 dark:text-zinc-100">
      {/* ── VISUAL IMAGE SHOWCASE ── */}
      <div className="space-y-4 sticky top-28">
        <div className="aspect-4/3 sm:aspect-square rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 overflow-hidden relative shadow-lg group">
          <SmartImage
            src={activeImage}
            alt={product.name}
            variant="med"
            aspectRatio="auto"
            className="w-full h-full"
            imageClassName="group-hover:scale-105 transition-transform duration-500"
            priority
          />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/60 dark:bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/20 shadow-sm">
              {product.categoryName}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-xs">
              🌿 100% Morning Plucked
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-xs">
              {t("madeToOrder")}
            </span>
          </div>
        </div>

        {/* Thumbnail selector row */}
        <div className="grid grid-cols-3 gap-3">
          {galleryImages.map((imgSrc, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(imgSrc)}
              className={`aspect-4/3 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeImage === imgSrc
                  ? "border-rose-600 ring-2 ring-rose-400 shadow-sm scale-102"
                  : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              <SmartImage
                src={imgSrc}
                alt={`${product.name} view ${i + 1}`}
                variant="thumb"
                aspectRatio="auto"
                className="w-full h-full"
              />
            </button>
          ))}
        </div>

        {/* Trust features */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 grid grid-cols-2 gap-3 text-xs text-zinc-700 dark:text-zinc-300 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Plucked 5:00 AM Fresh</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>WhatsApp Photo Proof</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Handmade to Order</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Guaranteed Muhurat Slot</span>
          </div>
        </div>
      </div>

      {/* ── PRODUCT DETAILS & CONFIGURATION ── */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-1">
            <span>{t("code")}: {product.code}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.95</span>
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">(68 Saurashtra brides)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black text-zinc-900 dark:text-white leading-tight">
            {product.name}
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Price Box */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-baseline justify-between">
            <span className={`font-bold ${showPrices ? "text-3xl sm:text-4xl font-serif text-zinc-900 dark:text-white" : "text-sm sm:text-base font-medium text-emerald-600 dark:text-emerald-400 font-sans"}`}>
              {getPriceDisplay(unitPrice, Boolean(showPrices), (locale as any) || "gu")}
            </span>
            <span className="text-xs font-mono text-zinc-500">
              {product.code}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {locale === "gu"
              ? "તાજા મોગરા અને ગુલાબથી હાથવણાટ ઓર્ડર મુજબ તૈયાર કરવામાં આવે છે."
              : locale === "hi"
              ? "ताजे मोगरा और गुलाब से हाथ से तैयार किया जाता है।"
              : "Hand-crafted to order using 100% fresh morning harvest flowers."}
          </p>
        </div>

        {/* BHAT SIMROLI BOUTIQUE STORE PICKUP INFO */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              {locale === "gu" ? "ભાટ સિમરોલી પિકઅપ" : "Bhat Simroli Store Pickup"}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ 100% Free Store Pickup
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {locale === "gu"
              ? "ઓર્ડર તૈયાર થયા બાદ શિવમ ફૂલ ઘર, ભાટ સિમરોલી દુકાનેથી સીધો મેળવો."
              : "Pickup freshly crafted florals directly from Shivam Full Ghar, Bhat Simroli."}
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              {locale === "gu" ? "સૌથી વહેલી તારીખ:" : "Earliest Pickup:"} <strong>{earliestDate}</strong> (8:00 AM)
            </span>
          </div>
        </div>

        {/* Length / Variant Options */}
        {product.options.length > 0 && (
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider block">
              {t("selectOption")}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {product.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedOption === opt.id
                      ? "bg-rose-500/15 border-rose-600 text-rose-600 dark:text-rose-300 font-bold shadow-xs ring-1 ring-rose-500"
                      : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  <span className="text-sm block">{opt.label}</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                    {showPrices ? (opt.priceAdd > 0 ? `+${formatPrice(opt.priceAdd)}` : "Included") : "Option"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {product.addOns.length > 0 && (
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider block">
              {t("addOns")}
            </label>
            <div className="space-y-2">
              {product.addOns.map((addon) => {
                const checked = selectedAddOns.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      checked
                        ? "bg-rose-500/15 border-rose-500 font-medium text-zinc-900 dark:text-white"
                        : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          checked
                            ? "bg-rose-600 border-rose-600 text-white"
                            : "border-zinc-400 bg-transparent"
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <span>{addon.label}</span>
                    </div>
                    {showPrices && (
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        +{formatPrice(addon.price)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Substitution Checkbox */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            id="subst"
            checked={allowSubstitutions}
            onChange={(e) => setAllowSubstitutions(e.target.checked)}
            className="mt-0.5 rounded text-rose-600 focus:ring-rose-600 cursor-pointer"
          />
          <label htmlFor="subst" className="cursor-pointer leading-relaxed">
            <strong>{t("substitutionTitle")}:</strong> {t("substitutionNotice")}
          </label>
        </div>

        {/* Quantity and Dual CTAs (WhatsApp Enquiry + Request Quote) */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center justify-between border border-black/15 dark:border-white/15 rounded-2xl bg-white dark:bg-white/5 px-3 py-2 w-32 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-zinc-900 dark:text-white text-sm font-serif">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Request Quote Button */}
            <Link
              href={`/${locale}/custom-design?code=${product.code}`}
              className="flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-800 dark:text-white border border-black/10 dark:border-white/10 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <span>
                {locale === "gu" ? "ભાવ મેળવો" : locale === "hi" ? "कोटेशन मांगें" : "Request Quote"}
              </span>
            </Link>
          </div>

          {/* Enquire on WhatsApp CTA */}
          <a
            href={`https://wa.me/919824132014?text=${encodeURIComponent(
              `Hello Shivam Full Ghar Bhat Simroli, I want to enquire about ${product.name} (Code: ${product.code}). Option: ${currentOption?.label || "Standard"}. Quantity: ${quantity}. Please share availability and details.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>
              {locale === "gu"
                ? "વોટ્સએપ પર પૂછપરછ કરો"
                : locale === "hi"
                ? "व्हाट्सएप पर पूछताछ करें"
                : "Enquire on WhatsApp"}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
