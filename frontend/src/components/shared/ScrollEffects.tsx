"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// 1. Zoom Out on Scroll / Enter
export function ZoomOutReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [1.1, 1, 0.97]);

  return (
    <motion.div ref={ref} style={{ scale }} className={className}>
      {children}
    </motion.div>
  );
}

// 2. Blur In Reveal
export function BlurInReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 3. Snap Horizontal Carousel
export function SnapCarousel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}

// 4. Stacking Sticky Cards
export function StackingCard({
  index,
  children,
  className = "",
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`sticky transition-transform duration-300 ${className}`}
      style={{ top: `${92 + index * 20}px`, zIndex: 10 + index }}
    >
      {children}
    </div>
  );
}

// 5. Shrink Header Wrapper
export function ShrinkHeaderWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ${
        shrunk ? "py-1.5 shadow-xl shadow-purple-950/15 backdrop-blur-2xl" : "py-3"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// 6. Tilt In 3D Card
export function TiltInCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 10, y: 24 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      style={{ transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 7. Count Up Animated Stat
export function CountUpNumber({
  target,
  suffix = "",
  duration = 1200,
  className = "",
}: {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let frameId = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const pct = Math.min(1, (ts - start) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - pct, 3))));
      if (pct < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={`font-mono-tech tabular-nums ${className}`}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

// 8. Mask Reveal Text / Container
export function MaskRevealText({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
