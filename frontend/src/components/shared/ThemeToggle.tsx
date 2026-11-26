"use client";

import { useState, useEffect } from "react";
import { Palette } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"green" | "red">("green");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sfg_brand_theme");
      const current = stored === "red" ? "red" : "green";
      setTheme(current);
      document.documentElement.setAttribute("data-theme", current);
    } catch {}

    const onThemeEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "green" || detail === "red") setTheme(detail);
    };
    window.addEventListener("brand-theme-changed", onThemeEvent);
    return () => window.removeEventListener("brand-theme-changed", onThemeEvent);
  }, []);

  const toggleTheme = () => {
    const next = theme === "green" ? "red" : "green";
    setTheme(next);
    try {
      localStorage.setItem("sfg_brand_theme", next);
      document.documentElement.setAttribute("data-theme", next);
      window.dispatchEvent(new CustomEvent("brand-theme-changed", { detail: next }));
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch theme (current: ${theme})`}
      title={theme === "green" ? "Switch Whole Site to Royal Red Theme" : "Switch Whole Site to Botanical Green Theme"}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-brand bg-white hover:bg-brand-surface text-xs font-semibold text-brand-deep transition-all cursor-pointer"
    >
      <span
        className="w-3 h-3 rounded-full border border-black/15 shrink-0"
        style={{ backgroundColor: theme === "green" ? "#244C38" : "#9F333E" }}
      />
      <Palette className="w-3.5 h-3.5 text-brand-primary hidden sm:inline" />
      <span className="hidden sm:inline">{theme === "green" ? "Green" : "Red"}</span>
    </button>
  );
}
