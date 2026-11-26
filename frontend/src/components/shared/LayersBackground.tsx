"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Layered Mesh & 3D Botanical Backdrop (inspired by getlayers.ai/backgrounds & 3d-scenes)
 * Unified Emerald Green (#10B981 / #064E3B) + Royal Red/Saffron (#E11D48 / #F97316) palette
 */
export function LayersBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle 3D Perspective Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(225,29,72,0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 25%, black 35%, transparent 100%)",
        }}
      />

      {/* Emerald Green Ambient Orb */}
      <motion.div
        animate={{ x: [0, 35, 0], y: [0, 25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full bg-brand-primary/15 dark:bg-brand-primary/20 blur-[110px]"
      />

      {/* Royal Red / Vermilion Ambient Orb */}
      <motion.div
        animate={{ x: [0, -35, 0], y: [0, -25, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -right-28 w-[480px] h-[480px] rounded-full bg-brand-primary/12 dark:bg-brand-primary/18 blur-[120px]"
      />

      {/* Warm Saffron / Orange Accent Glow */}
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 w-[380px] h-[380px] rounded-full bg-orange-500/10 dark:bg-orange-500/12 blur-[120px]"
      />
    </div>
  );
}
