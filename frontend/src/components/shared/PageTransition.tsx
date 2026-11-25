"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export type TransitionMode =
  | "slide"
  | "fade"
  | "zoom"
  | "shared"
  | "modal-sheet"
  | "flip"
  | "circle-reveal"
  | "card-stack";

const VARIANTS: Record<TransitionMode, { initial: any; animate: any; exit: any }> = {
  slide: {
    initial: { x: 40, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    initial: { scale: 0.94, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.04, opacity: 0 },
  },
  shared: {
    initial: { y: 12, scale: 0.98, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: { y: -12, opacity: 0 },
  },
  "modal-sheet": {
    initial: { y: "100%", opacity: 0.5 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
  "circle-reveal": {
    initial: { clipPath: "circle(0% at 50% 50%)", opacity: 0.7 },
    animate: { clipPath: "circle(150% at 50% 50%)", opacity: 1 },
    exit: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
  },
  "card-stack": {
    initial: { y: 32, scale: 0.92, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: { y: -20, scale: 0.96, opacity: 0 },
  },
};

export function PageTransitionWrapper({
  mode = "fade",
  transitionKey,
  children,
  className = "",
}: {
  mode?: TransitionMode;
  transitionKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  const v = VARIANTS[mode];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={mode === "flip" ? { transformPerspective: 1200 } : undefined}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
