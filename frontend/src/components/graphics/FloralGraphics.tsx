"use client";

import React from "react";

/**
 * Token-coloured Floral SVG Graphics (< 15KB total, adapts to active data-theme)
 */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-2 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-brand-primary/30" />
      <svg viewBox="0 0 36 36" className="w-6 h-6 text-brand-primary" fill="currentColor">
        <path d="M18 3C21 9 22 14 18 18C14 14 15 9 18 3Z" />
        <path d="M18 33C21 27 22 22 18 18C14 22 15 27 18 33Z" opacity="0.75" />
        <path d="M3 18C9 15 14 14 18 18C14 22 9 21 3 18Z" opacity="0.85" />
        <path d="M33 18C27 15 22 14 18 18C22 22 27 21 33 18Z" opacity="0.85" />
        <circle cx="18" cy="18" r="2.8" fill="#D7B77C" />
      </svg>
      <span className="h-px w-16 bg-brand-primary/30" />
    </div>
  );
}

export function LotusCrest({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path d="M24 6C29 14 30 24 24 32C18 24 19 14 24 6Z" fill="var(--brand-primary)" />
      <path d="M15 12C8 18 8 28 20 32C17 24 16 17 15 12Z" fill="var(--brand-accent)" opacity="0.85" />
      <path d="M33 12C40 18 40 28 28 32C31 24 32 17 33 12Z" fill="var(--brand-accent)" opacity="0.85" />
      <path d="M8 27C8 35 16 40 24 37C32 40 40 35 40 27C33 33 15 33 8 27Z" fill="#D7B77C" />
    </svg>
  );
}
