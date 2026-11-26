"use client";

import React, { useState } from "react";
import { MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/shared/SmartImage";

export interface GalleryItemData {
  title: string;
  location: string;
  category: string;
  image: string;
}

export function GalleryLightboxGrid({ items }: { items: GalleryItemData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = selectedCategory === "All" ? items : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? "bg-brand-primary text-[#FAF7EF]"
                : "bg-white border border-brand text-[#282A26] hover:border-brand/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setLightboxIdx(idx)}
            className="group text-left rounded-3xl overflow-hidden bg-white border border-brand shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3EFE4]">
              <SmartImage
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-deep/85 text-[#FAF7EF] text-[10px] font-semibold">
                {item.category}
              </span>
            </div>
            <div className="p-5 space-y-1">
              <h3 className="font-serif font-bold text-lg text-brand-deep line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#282A26]/70 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span>{item.location}</span>
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIdx !== null && filtered[lightboxIdx] && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#FAF7EF] rounded-3xl overflow-hidden shadow-2xl border border-[#D7B77C]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close lightbox"
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-brand-deep text-[#FAF7EF]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-[4/3] bg-brand-deep/10">
              <img
                src={filtered[lightboxIdx].image}
                alt={filtered[lightboxIdx].title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-brand-deep/85 text-[#FAF7EF]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx + 1) % filtered.length)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-brand-deep/85 text-[#FAF7EF]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-xl text-brand-deep">
                  {filtered[lightboxIdx].title}
                </h4>
                <p className="text-xs text-brand-primary font-medium">
                  {filtered[lightboxIdx].location} • {filtered[lightboxIdx].category}
                </p>
              </div>
              <span className="text-xs font-mono-tech text-[#282A26]/70">
                {lightboxIdx + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
