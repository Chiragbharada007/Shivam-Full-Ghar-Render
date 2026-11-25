"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Sparkles, X, Menu } from "lucide-react";

export type SidebarStyleMode =
  | "overlay"
  | "push"
  | "reveal"
  | "icon-rail"
  | "expanding"
  | "accordion"
  | "two-level"
  | "floating";

export type SidebarThemeMode = "purple-glass" | "ember-coral";

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { href: string; label: string }[];
}

export function AdaptiveSidebarShell({
  brandName,
  brandSubtitle,
  logoUrl,
  navItems,
  currentPath,
  defaultTheme = "purple-glass",
  defaultStyle = "floating",
  footerSlot,
  children,
}: {
  brandName: string;
  brandSubtitle: string;
  logoUrl?: string;
  navItems: SidebarNavItem[];
  currentPath: string;
  defaultTheme?: SidebarThemeMode;
  defaultStyle?: SidebarStyleMode;
  footerSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [styleMode, setStyleMode] = useState<SidebarStyleMode>(defaultStyle);
  const [themeMode, setThemeMode] = useState<SidebarThemeMode>(defaultTheme);
  const [openMobile, setOpenMobile] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [hoveredRail, setHoveredRail] = useState(false);

  const isPurple = themeMode === "purple-glass";

  const surfaceClass = isPurple
    ? "glass-purple text-zinc-100"
    : "glass-coral text-zinc-900";

  const activeItemClass = isPurple
    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-700/30"
    : "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/25";

  const inactiveItemClass = isPurple
    ? "text-zinc-300 hover:text-white hover:bg-white/10"
    : "text-zinc-700 hover:text-rose-700 hover:bg-rose-500/10";

  const isCompactRail =
    styleMode === "icon-rail" || (styleMode === "expanding" && !hoveredRail);

  const sidebarWidth = isCompactRail ? "w-[76px]" : "w-68";
  const isFloating = styleMode === "floating";

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
        isPurple
          ? "bg-[#07050c] text-zinc-100"
          : "bg-[#fff8f7] text-zinc-900"
      }`}
    >
      {/* Mobile Top Bar */}
      <div className={`md:hidden flex items-center justify-between px-4 py-3 border-b ${isPurple ? "border-purple-500/20 bg-[#0c0816]" : "border-rose-200 bg-white"}`}>
        <div className="flex items-center gap-2.5">
          <img src={logoUrl || "/icon.svg"} alt={brandName} className="w-8 h-8 rounded-xl object-contain" />
          <span className="font-display font-bold text-sm">{brandName}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpenMobile((v) => !v)}
          className="p-2 rounded-xl bg-black/5 dark:bg-white/10"
        >
          {openMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Curved Sidebar */}
      <aside
        onMouseEnter={() => styleMode === "expanding" && setHoveredRail(true)}
        onMouseLeave={() => styleMode === "expanding" && setHoveredRail(false)}
        className={`${
          openMobile ? "fixed inset-y-0 left-0 z-50 flex" : "hidden md:flex"
        } ${sidebarWidth} ${
          isFloating ? "md:m-4 md:rounded-[30px]" : "md:rounded-r-[30px]"
        } ${surfaceClass} flex-col justify-between p-4 shrink-0 transition-all duration-300`}
      >
        <div className="space-y-5">
          {/* Brand Profile Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/30 to-rose-500/30 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={logoUrl || "/icon.svg"} alt={brandName} className="w-7 h-7 object-contain" />
            </div>
            {!isCompactRail && (
              <div className="min-w-0">
                <span className="font-display font-extrabold text-sm block truncate">
                  {brandName}
                </span>
                <span className={`text-[10px] font-mono-tech block truncate ${isPurple ? "text-purple-300" : "text-rose-600"}`}>
                  {brandSubtitle}
                </span>
              </div>
            )}
          </div>

          {/* Live Sidebar Mode & Theme Switcher */}
          {!isCompactRail && (
            <div className={`p-2.5 rounded-2xl space-y-2 border ${isPurple ? "bg-white/5 border-white/10" : "bg-rose-50/80 border-rose-200"}`}>
              <div className="flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-wider opacity-75">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Layout
                </span>
                <button
                  type="button"
                  onClick={() => setThemeMode((t) => (t === "purple-glass" ? "ember-coral" : "purple-glass"))}
                  className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold"
                >
                  {isPurple ? "Purple Glass" : "Ember Coral"}
                </button>
              </div>
              <select
                value={styleMode}
                onChange={(e) => setStyleMode(e.target.value as SidebarStyleMode)}
                className={`w-full text-[11px] px-2 py-1.5 rounded-xl border focus:outline-hidden ${
                  isPurple ? "bg-[#120b22] border-purple-500/30 text-white" : "bg-white border-rose-200 text-zinc-900"
                }`}
              >
                <option value="floating">8. Floating Curved</option>
                <option value="overlay">1. Overlay</option>
                <option value="push">2. Push</option>
                <option value="reveal">3. Reveal</option>
                <option value="icon-rail">4. Icon Rail</option>
                <option value="expanding">5. Expanding Rail</option>
                <option value="accordion">6. Accordion</option>
                <option value="two-level">7. Two-Level</option>
              </select>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1.5 text-xs font-geometric font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath.startsWith(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = expandedGroup === item.href;

              return (
                <div key={item.href}>
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.href}
                      onClick={() => setOpenMobile(false)}
                      title={item.label}
                      className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
                        isActive ? activeItemClass : inactiveItemClass
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isCompactRail && <span className="truncate">{item.label}</span>}
                    </Link>
                    {hasChildren && !isCompactRail && (
                      <button
                        type="button"
                        onClick={() => setExpandedGroup(isOpen ? null : item.href)}
                        className="p-1.5 rounded-lg opacity-70 hover:opacity-100"
                      >
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                  {hasChildren && isOpen && !isCompactRail && (
                    <div className="ml-7 mt-1 space-y-1 border-l border-purple-500/30 pl-3">
                      {item.children!.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block py-1 text-[11px] opacity-80 hover:opacity-100"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Slot */}
        {!isCompactRail && footerSlot && (
          <div className={`pt-4 border-t ${isPurple ? "border-white/10" : "border-rose-200"}`}>
            {footerSlot}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
