"use client";

import { useState, useEffect } from "react";

export type BrandTheme = "green" | "red" | "marigold" | "pearl" | "blush" | "festival";

export const BRAND_THEMES: { id: BrandTheme; label: string; color: string }[] = [
  { id: "green", label: "Leaf Green", color: "#244C38" },
  { id: "red", label: "Rose Red", color: "#9F333E" },
  { id: "marigold", label: "Marigold", color: "#B45309" },
  { id: "blush", label: "Blush Pink", color: "#BE185D" },
  { id: "pearl", label: "Pearl White", color: "#475569" },
  { id: "festival", label: "Festival", color: "#C2410C" },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<BrandTheme>("green");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sfg_brand_theme") as BrandTheme | null;
      const valid = BRAND_THEMES.some((t) => t.id === stored) ? (stored as BrandTheme) : "green";
      setTheme(valid);
      document.documentElement.setAttribute("data-theme", valid);
    } catch {}

    const onThemeEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as BrandTheme;
      if (BRAND_THEMES.some((t) => t.id === detail)) setTheme(detail);
    };
    window.addEventListener("brand-theme-changed", onThemeEvent);
    return () => window.removeEventListener("brand-theme-changed", onThemeEvent);
  }, []);

  const selectTheme = (next: BrandTheme) => {
    setTheme(next);
    try {
      localStorage.setItem("sfg_brand_theme", next);
      document.documentElement.setAttribute("data-theme", next);
      window.dispatchEvent(new CustomEvent("brand-theme-changed", { detail: next }));
    } catch {}
  };

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-brand bg-white"
      role="group"
      aria-label="Colour theme switcher"
    >
      {BRAND_THEMES.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => selectTheme(t.id)}
            title={t.label}
            aria-label={`Switch theme to ${t.label}`}
            className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
              active ? "scale-125 ring-2 ring-offset-1 ring-brand-deep" : "opacity-75 hover:opacity-100 hover:scale-110"
            }`}
            style={{ backgroundColor: t.color }}
          />
        );
      })}
    </div>
  );
}
