"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Check, ArrowDown, Ruler, Layers } from "lucide-react";
import { formatPrice, getPriceDisplay } from "@/lib/utils";

interface BuilderOption {
  id: string;
  name: string;
  nameGu: string;
  nameHi: string;
  basePrice: number;
  image: string;
  description: string;
}

const FLOWER_BASES: BuilderOption[] = [
  {
    id: "red-rose-mogra",
    name: "Dutch Red Rose & Fragrant Mogra",
    nameGu: "લાલ ગુલાબ અને મધુરી મોગરા કળી",
    nameHi: "लाल गुलाब और सुगंधित मोगरा कली",
    basePrice: 4200,
    image: "/products/VM-R01.jpg",
    description: "Deep velvety Dutch roses layered with fragrant hand-strung Madurai mogra buds.",
  },
  {
    id: "white-pearl-jasmine",
    name: "White Jasmine Pearl & Silver Accents",
    nameGu: "શ્વેત મોગરા અને મોતી ગુલાબ",
    nameHi: "श्वेत मोगरा और मोती गुलाब",
    basePrice: 3800,
    image: "/products/VM-W01.jpg",
    description: "Crisp ivory jasmine buds entwined with white baby roses for serene royal grace.",
  },
  {
    id: "pink-blush-carnation",
    name: "Blush Pink Rose & Pastel Carnation",
    nameGu: "ગુલાબી રોઝ અને પેસ્ટલ કાર્નેશન",
    nameHi: "गुलाबी रोज़ और पेस्टल कार्नेशन",
    basePrice: 4400,
    image: "/products/VM-P01.jpg",
    description: "Soft romantic blush roses accented with delicate pastel carnations and baby's breath.",
  },
  {
    id: "sunshine-marigold",
    name: "Vibrant Marigold & Yellow Rose",
    nameGu: "કેસરિયો ગલગોટો અને પીળા ગુલાબ",
    nameHi: "केसरिया गेंदा और पीले गुलाब",
    basePrice: 2800,
    image: "/products/VM-Y01.jpg",
    description: "Traditional auspicious gold and saffron marigolds, perfect for daytime mandap rituals.",
  },
  {
    id: "royal-orchid-rose",
    name: "Grand Orchid & Velvet Rose Heritage",
    nameGu: "રોયલ ઓર્કિડ અને વેલ્વેટ ગુલાબ",
    nameHi: "रॉयल ऑर्किड और मखमली गुलाब",
    basePrice: 5800,
    image: "/products/VM-R02.jpg",
    description: "Exotic purple orchids, Dutch roses, and green foliage for luxury destination weddings.",
  },
];

const LENGTH_OPTIONS = [
  { length: "3.5 ft", priceMultiplier: 0.9, label: "Petite / Compact (3.5 ft)" },
  { length: "4.0 ft", priceMultiplier: 1.0, label: "Classic Standard (4.0 ft)" },
  { length: "4.5 ft", priceMultiplier: 1.15, label: "Grand Wedding (4.5 ft) - Most Popular" },
  { length: "5.0 ft", priceMultiplier: 1.3, label: "Royal Heritage (5.0 ft)" },
  { length: "5.5 ft", priceMultiplier: 1.45, label: "Palace Opulence (5.5 ft)" },
];

const WEAVE_DENSITIES = [
  { id: "classic", name: "Classic Spiral Weave", addOn: 0, desc: "Traditional light weight and flexible drape." },
  { id: "double", name: "Double Dense Regal Weave", addOn: 600, desc: "Full volume, tightly packed blossoms that stay fresh all day." },
  { id: "triple", name: "Triple Royal Heritage Weave", addOn: 1200, desc: "Museum-grade density with multi-tiered blossom layering." },
];

const ACCENTS = [
  { id: "zari", name: "Gold Zari Threading & Tassels", price: 300 },
  { id: "pearl", name: "Pearl Bead Border Weave", price: 400 },
  { id: "rajnigandha", name: "Fragrant Rajnigandha Hanging Strings", price: 350 },
  { id: "lotus", name: "Sacred Fresh Lotus Bud Medallions", price: 500 },
];

interface CustomGarlandBuilderProps {
  onApplyConfig: (config: {
    baseName: string;
    length: string;
    weaveName: string;
    accents: string[];
    estimatedTotal: number;
    referenceImage: string;
  }) => void;
  locale: string;
  showPrices?: boolean;
}

export function CustomGarlandBuilder({
  onApplyConfig,
  locale,
  showPrices: propShowPrices,
}: CustomGarlandBuilderProps) {
  const [showPrices, setShowPrices] = useState(propShowPrices ?? false);

  useEffect(() => {
    if (propShowPrices === undefined) {
      fetch("/api/site-settings")
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.settings) {
            setShowPrices(Boolean(d.settings.showPrices));
          }
        })
        .catch(() => null);
    } else {
      setShowPrices(propShowPrices);
    }
  }, [propShowPrices]);
  const [selectedBase, setSelectedBase] = useState<BuilderOption>(FLOWER_BASES[0]);
  const [selectedLength, setSelectedLength] = useState(LENGTH_OPTIONS[2]); // 4.5 ft
  const [selectedWeave, setSelectedWeave] = useState(WEAVE_DENSITIES[1]); // Double dense
  const [selectedAccents, setSelectedAccents] = useState<string[]>(["zari", "pearl"]);

  const toggleAccent = (id: string) => {
    setSelectedAccents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate live price
  const baseEstimated = Math.round(selectedBase.basePrice * selectedLength.priceMultiplier);
  const weaveAddOn = selectedWeave.addOn;
  const accentsTotal = selectedAccents.reduce((sum, accId) => {
    const acc = ACCENTS.find((a) => a.id === accId);
    return sum + (acc ? acc.price : 0);
  }, 0);
  const estimatedTotal = baseEstimated + weaveAddOn + accentsTotal;
  const advanceAmount = Math.ceil((estimatedTotal * 40) / 100);

  const handleApply = () => {
    const accentNames = selectedAccents
      .map((id) => ACCENTS.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[];

    onApplyConfig({
      baseName: selectedBase.name,
      length: selectedLength.length,
      weaveName: selectedWeave.name,
      accents: accentNames,
      estimatedTotal,
      referenceImage: selectedBase.image,
    });
  };

  return (
    <section className="bg-white dark:bg-[#0c0c0c] rounded-3xl border border-stone-200 dark:border-white/10 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-brand-deep dark:text-brand-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Interactive Varmala Customiser</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-white mt-1">
            Build Your Bespoke Wedding Garland Pair
          </h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Select flowers, garland length, density, and sacred embellishments for live price estimation.
          </p>
        </div>
        <div className="text-right bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl px-4 py-2.5">
          <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-zinc-400 block">
            Estimated Pair Price
          </span>
          <span className={`font-bold ${showPrices ? "text-2xl font-serif text-brand-deep dark:text-brand-primary" : "text-xs font-semibold text-brand-deep dark:text-brand-primary font-sans"}`}>
            {getPriceDisplay(estimatedTotal, showPrices, (locale as any) || "gu")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: Customization controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Base Flower Style */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-deep dark:bg-brand-deep text-white text-[11px] font-mono flex items-center justify-center">
                1
              </span>
              <span>Choose Floral Theme & Flower Palette</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FLOWER_BASES.map((flower) => {
                const isSelected = selectedBase.id === flower.id;
                return (
                  <button
                    key={flower.id}
                    type="button"
                    onClick={() => setSelectedBase(flower)}
                    className={`text-left p-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                      isSelected
                        ? "border-brand bg-brand-surface dark:bg-brand-deep/40 shadow-xs ring-1 ring-brand"
                        : "border-stone-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-600 bg-white dark:bg-zinc-900/60"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-stone-200 dark:border-white/10">
                      <Image
                        src={flower.image}
                        alt={flower.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {locale === "gu" ? flower.nameGu : locale === "hi" ? flower.nameHi : flower.name}
                      </p>
                      {showPrices && (
                        <p className="text-[11px] text-stone-500 dark:text-zinc-400 line-clamp-1">
                          From {formatPrice(flower.basePrice)}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-brand-deep dark:bg-brand-primary text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Length */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-deep dark:bg-brand-deep text-white text-[11px] font-mono flex items-center justify-center">
                2
              </span>
              <Ruler className="w-3.5 h-3.5 text-stone-600 dark:text-zinc-400" />
              <span>Garland Length (Pair)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LENGTH_OPTIONS.map((opt) => {
                const isSelected = selectedLength.length === opt.length;
                return (
                  <button
                    key={opt.length}
                    type="button"
                    onClick={() => setSelectedLength(opt)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? "bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-900 dark:border-white shadow-xs"
                        : "bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 border-stone-200 dark:border-white/10 hover:border-stone-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    {opt.length}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-500 dark:text-zinc-400">
              Selected: <span className="font-semibold text-stone-700 dark:text-zinc-200">{selectedLength.label}</span>
            </p>
          </div>

          {/* Step 3: Weave Density */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-deep dark:bg-brand-deep text-white text-[11px] font-mono flex items-center justify-center">
                3
              </span>
              <Layers className="w-3.5 h-3.5 text-stone-600 dark:text-zinc-400" />
              <span>Garland Density & Crafting Weave</span>
            </label>
            <div className="space-y-2">
              {WEAVE_DENSITIES.map((w) => {
                const isSelected = selectedWeave.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWeave(w)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/40 dark:bg-amber-950/30"
                        : "border-stone-200 dark:border-white/10 hover:border-amber-200 dark:hover:border-amber-700 bg-stone-50/30 dark:bg-zinc-900/30"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-zinc-200">{w.name}</span>
                      <p className="text-[11px] text-stone-500 dark:text-zinc-400">{w.desc}</p>
                    </div>
                    {showPrices && (
                      <span className="text-xs font-mono font-bold text-stone-700 dark:text-zinc-300">
                        {w.addOn === 0 ? "Included" : `+${formatPrice(w.addOn)}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 4: Accents */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-deep dark:bg-brand-deep text-white text-[11px] font-mono flex items-center justify-center">
                4
              </span>
              <span>Luxury Accents & Sacred Embellishments</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACCENTS.map((acc) => {
                const active = selectedAccents.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccent(acc.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      active
                        ? "border-brand bg-brand-surface dark:bg-brand-deep/30"
                        : "border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 hover:border-stone-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-800 dark:text-zinc-200">{acc.name}</p>
                      {showPrices && (
                        <p className="text-[11px] text-brand-deep dark:text-brand-primary font-mono font-semibold">
                          +{formatPrice(acc.price)}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        active
                          ? "bg-brand-primary border-brand text-white"
                          : "border-stone-300 dark:border-zinc-700"
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Live Preview Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-stone-50 to-amber-50/50 dark:from-zinc-900/90 dark:to-zinc-950 rounded-2xl border border-stone-200 dark:border-white/10 p-5 space-y-5 sticky top-24">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-stone-300 dark:border-white/10 shadow-inner">
            <Image
              src={selectedBase.image}
              alt={selectedBase.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Live Spec Preview</span>
            </div>
          </div>

          <div className="space-y-2 border-b border-stone-200 dark:border-white/10 pb-4">
            <h3 className="font-serif font-black text-stone-900 dark:text-white text-lg leading-snug">
              {selectedBase.name}
            </h3>
            <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
              {selectedBase.description}
            </p>
          </div>

          {/* Breakdown table */}
          {showPrices ? (
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Garland Base ({selectedLength.length})</span>
                <span className="font-mono font-medium text-stone-800 dark:text-zinc-200">{formatPrice(baseEstimated)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>{selectedWeave.name}</span>
                <span className="font-mono font-medium text-stone-800 dark:text-zinc-200">
                  {selectedWeave.addOn === 0 ? "Free" : formatPrice(selectedWeave.addOn)}
                </span>
              </div>
              {selectedAccents.length > 0 && (
                <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                  <span>Selected Accents ({selectedAccents.length})</span>
                  <span className="font-mono font-medium text-stone-800 dark:text-zinc-200">{formatPrice(accentsTotal)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 dark:border-white/10 flex justify-between font-bold text-stone-900 dark:text-white text-sm">
                <span>Total Estimated (Pair)</span>
                <span className="font-serif text-brand-deep dark:text-brand-primary text-base">
                  {formatPrice(estimatedTotal)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs text-zinc-600 dark:text-zinc-400">
              <span>{getPriceDisplay(estimatedTotal, false, (locale as any) || "gu")}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-deep hover:bg-brand-deep dark:bg-brand-deep dark:hover:bg-brand-deep text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Apply This Custom Garland to Form</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <p className="text-[10px] text-stone-500 dark:text-zinc-400 text-center mt-2">
              Transfers specifications to the inquiry form below for owner review and binding quotation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
