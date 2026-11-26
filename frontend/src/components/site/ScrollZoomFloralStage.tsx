"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const STAGE_IMAGES = [
  { src: "/products/VM-R01.jpg", label: "Royal Rose Varmala", pos: "w-48 h-48 sm:w-72 sm:h-72 z-30" },
  { src: "/products/CR-01.jpg", label: "Wedding Car Decor", pos: "w-36 h-36 sm:w-56 sm:h-56 -translate-x-28 -translate-y-24 sm:-translate-x-64 sm:-translate-y-28 z-20" },
  { src: "/products/GJ-01.jpg", label: "Madurai Mogra Gajra", pos: "w-36 h-36 sm:w-52 sm:h-52 translate-x-28 translate-y-24 sm:translate-x-64 sm:translate-y-24 z-20" },
  { src: "/products/FJ-01.jpg", label: "Haldi Floral Jewellery", pos: "w-32 h-32 sm:w-48 sm:h-48 -translate-x-28 translate-y-24 sm:-translate-x-60 sm:translate-y-28 z-10" },
  { src: "/products/VM-L01.jpg", label: "Lotus Royal Garland", pos: "w-32 h-32 sm:w-48 sm:h-48 translate-x-28 -translate-y-24 sm:translate-x-60 sm:-translate-y-28 z-10" },
];

export function ScrollZoomFloralStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const centerScale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.85, 1.18, 0.96]);
  const outerScale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.75, 1.08, 1.25]);
  const outerOpacity = useTransform(scrollYProgress, [0.05, 0.35, 0.85, 1], [0.3, 1, 1, 0.4]);

  return (
    <section ref={containerRef} className="relative py-10 overflow-hidden">
      <div className="text-center space-y-1.5 mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
          3D Scroll Showcase
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-deep">
          Every Angle in Living Depth
        </h2>
      </div>

      <div className="relative h-[420px] sm:h-[520px] rounded-3xl bg-brand-surface border border-brand flex items-center justify-center overflow-hidden">
        {STAGE_IMAGES.map((item, idx) => (
          <motion.div
            key={item.label}
            style={{
              scale: idx === 0 ? centerScale : outerScale,
              opacity: idx === 0 ? 1 : outerOpacity,
            }}
            className="absolute flex items-center justify-center will-change-transform"
          >
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80 ${item.pos}`}>
              <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
              <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-brand-deep/85 text-[#FAF7EF] text-[10px] font-semibold text-center truncate">
                {item.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
