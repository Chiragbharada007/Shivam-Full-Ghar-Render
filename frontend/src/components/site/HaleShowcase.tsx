"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles, X, Check } from "lucide-react";
import { SteppedSlider, ColorHueSlider } from "@/components/ui/SmartSliders";
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
  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [hue, setHue] = useState(340);
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
      undoLabel: "Undo",
      onUndo: () => setBag((prev) => prev.slice(0, -1)),
    });
  };

  return (
    <section className="relative rounded-[36px] p-6 md:p-10 glass-purple text-white overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Left: 3D Interactive Garment/Garland Stage */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono-tech bg-purple-500/20 text-purple-200 border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" /> 3D Virtual Floral Preview
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
                  className={`px-3 py-1 rounded-full text-xs font-geometric font-semibold transition-all ${
                    category === cat
                      ? "bg-gradient-to-r from-purple-500 to-rose-500 text-white shadow-md"
                      : "bg-white/10 text-zinc-300 hover:bg-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-72 sm:h-88 rounded-[24px] bg-gradient-to-b from-purple-950/60 to-black/70 border border-purple-400/20 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={active.id}
                src={active.image}
                alt={active.name}
                initial={{ opacity: 0, rotateY: -22, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 22, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                style={{ filter: `drop-shadow(0 20px 35px hsla(${hue}, 80%, 50%, 0.35))` }}
                className="h-56 sm:h-72 w-auto object-contain rounded-2xl"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
              className="absolute left-3 p-2.5 rounded-full bg-black/60 hover:bg-purple-600 text-white border border-white/15 transition-colors"
              aria-label="Previous design"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % list.length)}
              className="absolute right-3 p-2.5 rounded-full bg-black/60 hover:bg-purple-600 text-white border border-white/15 transition-colors"
              aria-label="Next design"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Controls + Same-Page Bag */}
        <div className="w-full lg:w-96 space-y-5">
          <div>
            <span className="text-[11px] font-mono-tech text-purple-300">{active.code} • {active.category}</span>
            <h3 className="font-display text-2xl font-extrabold mt-1">{active.name}</h3>
            <p className="font-mono-tech text-lg text-rose-300 font-bold mt-1">
              ₹{active.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-geometric text-zinc-300">Select Garland Length</span>
            <SteppedSlider steps={sizes} index={sizeIdx} onChange={setSizeIdx} />
          </div>

          <ColorHueSlider hue={hue} onChange={setHue} />

          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-rose-600 hover:opacity-95 text-white font-geometric font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-700/30 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag ({bag.length})</span>
          </button>
        </div>
      </div>

      {/* Same-Page Slide-Over Bag Modal Sheet */}
      <AnimatePresence>
        {bagOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-[80] w-80 max-w-[90vw] glass-purple text-white p-6 flex flex-col justify-between border-l border-purple-500/30"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-display font-bold text-base">Wedding Bag ({bag.length})</h4>
                <button onClick={() => setBagOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
                {bag.map((b, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs">
                    <img src={b.item.image} alt={b.item.name} className="w-11 h-11 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate">{b.item.name}</p>
                      <p className="text-purple-300 font-mono-tech">{b.size} • ₹{b.item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBagOpen(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Continue Browsing</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
