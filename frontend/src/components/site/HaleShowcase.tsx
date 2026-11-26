"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag, Flower2, X, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { useNotifications } from "@/components/shared/NotificationSystem";

interface ShowcaseItem {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

const DEFAULT_SHOWCASE: ShowcaseItem[] = [
  { id: "1", code: "VM-R01", name: "Royal Dutch Rose & Lotus Varmala", category: "Varmala", price: 2100, image: "/products/VM-R01.jpg" },
  { id: "2", code: "VM-R02", name: "Maharaja Mogra & Crimson Garland", category: "Varmala", price: 1800, image: "/products/VM-R02.jpg" },
  { id: "3", code: "CR-01", name: "Bridal Sedan Orchid & Rose Decor", category: "Car Decor", price: 3100, image: "/products/CR-01.jpg" },
  { id: "4", code: "GJ-01", name: "Madurai Mogra Bridal Gajra Pair", category: "Gajra", price: 650, image: "/products/GJ-01.jpg" },
  { id: "5", code: "FJ-01", name: "Haldi Fresh Floral Jewellery Set", category: "Jewellery", price: 1450, image: "/products/FJ-01.jpg" },
];

export function HaleShowcase({ items = DEFAULT_SHOWCASE }: { items?: ShowcaseItem[] }) {
  const locale = useLocale();
  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [bagOpen, setBagOpen] = useState(false);
  const [bag, setBag] = useState<{ item: ShowcaseItem; size: string }[]>([]);
  const { notify } = useNotifications();

  const categories = ["All", "Varmala", "Car Decor", "Gajra", "Jewellery"];
  const filtered = category === "All" ? items : items.filter((i) => i.category === category);
  const list = filtered.length > 0 ? filtered : items;
  const active = list[index % list.length];
  const sizes = ["3.5 ft", "4.5 ft", "5.5 ft", "6.5 ft"];

  const handleAdd = () => {
    setBag((prev) => [...prev, { item: active, size: sizes[sizeIdx] }]);
    setBagOpen(true);
    notify({
      title: "Added to Wedding Bag",
      message: `${active.name} (${sizes[sizeIdx]})`,
      variant: "success",
    });
  };

  return (
    <section className="rounded-3xl p-6 md:p-10 bg-white border border-[#244C38]/15 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Interactive Preview Stage */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#244C38]/10 text-[#244C38]">
              <Flower2 className="w-3.5 h-3.5 text-[#9F333E]" /> Interactive Floral Preview
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    category === cat
                      ? "bg-[#244C38] text-[#FAF7EF]"
                      : "bg-[#FAF7EF] text-[#282A26] border border-[#244C38]/15 hover:border-[#244C38]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-72 sm:h-88 rounded-2xl bg-[#FAF7EF] border border-[#244C38]/12 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={active.id}
                src={active.image}
                alt={active.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="h-60 sm:h-76 w-auto object-contain rounded-xl"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
              className="absolute left-3 p-2.5 rounded-full bg-white/90 hover:bg-[#244C38] hover:text-white text-[#163526] border border-[#244C38]/20 shadow-xs transition-colors"
              aria-label="Previous design"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % list.length)}
              className="absolute right-3 p-2.5 rounded-full bg-white/90 hover:bg-[#244C38] hover:text-white text-[#163526] border border-[#244C38]/20 shadow-xs transition-colors"
              aria-label="Next design"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Details & Quick Add */}
        <div className="w-full lg:w-96 space-y-5">
          <div>
            <span className="text-xs font-mono-tech uppercase tracking-wider text-[#9F333E] font-semibold">
              {active.code} • {active.category}
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#163526] mt-1">{active.name}</h3>
            <p className="font-mono-tech text-lg text-[#244C38] font-bold mt-1">
              ₹{active.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#282A26]/80 block">Select Length / Size</span>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((s, idx) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSizeIdx(idx)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    sizeIdx === idx
                      ? "bg-[#244C38] text-[#FAF7EF] border-[#244C38]"
                      : "bg-[#FAF7EF] text-[#282A26] border-[#244C38]/20 hover:border-[#244C38]/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-3.5 px-5 rounded-xl bg-[#244C38] hover:bg-[#163526] text-[#FAF7EF] font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#D7B77C]" />
              <span>Add to Bag ({bag.length})</span>
            </button>
            <Link
              href={`/${locale}/custom-design`}
              className="w-full py-2.5 px-5 rounded-xl border border-[#9F333E]/30 text-[#9F333E] hover:bg-[#9F333E]/8 font-semibold text-xs text-center transition-colors"
            >
              Customize Colours & Flowers
            </Link>
          </div>
        </div>
      </div>

      {/* Same-Page Slide-Over Bag Drawer */}
      <AnimatePresence>
        {bagOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-[80] w-80 max-w-[90vw] bg-[#FAF7EF] text-[#282A26] p-6 flex flex-col justify-between border-l border-[#244C38]/20 shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#244C38]/15 pb-3">
                <h4 className="font-serif font-bold text-xl text-[#163526]">Wedding Bag ({bag.length})</h4>
                <button onClick={() => setBagOpen(false)} className="p-1.5 rounded-lg hover:bg-[#244C38]/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
                {bag.map((b, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white border border-[#244C38]/12 flex items-center gap-3 text-xs">
                    <img src={b.item.image} alt={b.item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#163526] truncate">{b.item.name}</p>
                      <p className="text-[#9F333E] font-mono-tech">{b.size} • ₹{b.item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBagOpen(false)}
              className="w-full py-3 rounded-xl bg-[#244C38] hover:bg-[#163526] text-[#FAF7EF] text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 text-[#D7B77C]" />
              <span>Continue Browsing</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
