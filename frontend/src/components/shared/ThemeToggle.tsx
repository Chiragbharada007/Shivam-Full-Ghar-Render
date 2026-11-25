"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sfg_theme");
      if (stored === "light") {
        setTheme("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      } else {
        setTheme("dark");
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    } catch (e) {}

    const handleThemeChange = (e: any) => {
      if (e.detail) {
        setTheme(e.detail);
      }
    };
    window.addEventListener("theme-changed", handleThemeChange);
    return () => window.removeEventListener("theme-changed", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("sfg_theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.style.colorScheme = "light";
      }
      window.dispatchEvent(new CustomEvent("theme-changed", { detail: nextTheme }));
    } catch (e) {}
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme (Dark / Light)"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative p-2 rounded-full transition-all duration-300 cursor-pointer bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-stone-800 dark:text-zinc-300 focus:outline-hidden hover:scale-105 active:scale-95"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400 rotate-0 scale-100 transition-all duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-zinc-900 rotate-0 scale-100 transition-all duration-300 hover:-rotate-12" />
        )}
      </div>
    </button>
  );
}
