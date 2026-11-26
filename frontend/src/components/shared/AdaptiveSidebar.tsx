"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Sparkles, X, Menu, PanelLeft } from "lucide-react";

export type SidebarStyleMode =
  | "overlay"
  | "push"
  | "reveal"
  | "icon-rail"
  | "expanding"
  | "accordion"
  | "two-level"
  | "floating";

export type SidebarThemeMode = "emerald-green" | "royal-red";

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
  defaultTheme = "emerald-green",
  defaultStyle = "floating",
  asDrawer = false,
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
  asDrawer?: boolean;
  footerSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [styleMode, setStyleMode] = useState<SidebarStyleMode>(defaultStyle);
  const [themeMode, setThemeMode] = useState<SidebarThemeMode>(defaultTheme);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(navItems[1]?.href || null);
  const [hoveredRail, setHoveredRail] = useState(false);
  const [activeParent, setActiveParent] = useState<SidebarNavItem | null>(
    navItems.find((n) => n.children && n.children.length > 0) || null
  );

  const isEmerald = themeMode === "emerald-green";

  const surfaceClass = isEmerald
    ? "glass-emerald text-zinc-100"
    : "glass-royal-red text-zinc-900";

  const activeItemClass = isEmerald
    ? "bg-gradient-to-r from-[var(--brand-primary)] via-emerald-500 to-rose-600 text-white shadow-lg shadow-emerald-900/35"
    : "bg-gradient-to-r from-[var(--brand-primary)] to-orange-500 text-white shadow-lg shadow-rose-500/25";

  const inactiveItemClass = isEmerald
    ? "text-emerald-100/85 hover:text-white hover:bg-brand-primary/15"
    : "text-zinc-700 hover:text-brand-deep hover:bg-brand-primary/10";

  const isCompactRail =
    !asDrawer && (styleMode === "icon-rail" || (styleMode === "expanding" && !hoveredRail));

  const sidebarWidth = isCompactRail ? "w-[76px]" : styleMode === "two-level" && activeParent?.children ? "w-80" : "w-68";
  const isFloating = styleMode === "floating";

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Brand Profile Header */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-rose-500/30 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={logoUrl || "/icon.svg"} alt={brandName} className="w-7 h-7 object-contain" />
            </div>
            {!isCompactRail && (
              <div className="min-w-0">
                <span className="font-display font-extrabold text-sm block truncate">
                  {brandName}
                </span>
                <span className={`text-[10px] font-mono-tech block truncate ${isEmerald ? "text-emerald-300" : "text-brand-primary"}`}>
                  {brandSubtitle}
                </span>
              </div>
            )}
          </div>
          {asDrawer && (
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Sidebar Mode & Theme Switcher */}
        {!isCompactRail && (
          <div className={`p-2.5 rounded-2xl space-y-2 border ${isEmerald ? "bg-white/5 border-brand" : "bg-brand-surface border-brand"}`}>
            <div className="flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-wider opacity-85">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Menu Style
              </span>
              <button
                type="button"
                onClick={() => setThemeMode((t) => (t === "emerald-green" ? "royal-red" : "emerald-green"))}
                className={`px-2 py-0.5 rounded-full text-white font-bold ${
                  isEmerald ? "bg-brand-primary" : "bg-brand-primary"
                }`}
              >
                {isEmerald ? "Emerald Green" : "Royal Red"}
              </button>
            </div>
            <select
              value={styleMode}
              onChange={(e) => setStyleMode(e.target.value as SidebarStyleMode)}
              className={`w-full text-[11px] px-2 py-1.5 rounded-xl border focus:outline-hidden ${
                isEmerald ? "bg-[#05261b] border-brand text-white" : "bg-white border-brand text-zinc-900"
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
        <div className={styleMode === "two-level" && !isCompactRail ? "flex gap-2" : ""}>
          <nav className={`space-y-1 text-xs font-geometric font-medium ${styleMode === "two-level" && !isCompactRail ? "w-1/2" : "w-full"}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href || (item.href.length > 4 && currentPath.startsWith(item.href));
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = expandedGroup === item.href;

              return (
                <div key={item.href}>
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (hasChildren) setActiveParent(item);
                        setDrawerOpen(false);
                      }}
                      title={item.label}
                      className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all ${
                        isActive ? activeItemClass : inactiveItemClass
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isCompactRail && <span className="truncate">{item.label}</span>}
                    </Link>
                    {hasChildren && !isCompactRail && styleMode !== "two-level" && (
                      <button
                        type="button"
                        onClick={() => setExpandedGroup(isOpen ? null : item.href)}
                        className="p-1.5 rounded-lg opacity-75 hover:opacity-100"
                      >
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                  {hasChildren && isOpen && !isCompactRail && styleMode !== "two-level" && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-brand pl-3">
                      {item.children!.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setDrawerOpen(false)}
                          className="block py-1 text-[11px] opacity-85 hover:opacity-100"
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

          {/* 7. Two-Level Sub-Panel */}
          {styleMode === "two-level" && !isCompactRail && activeParent?.children && (
            <div className={`w-1/2 p-2.5 rounded-2xl border space-y-1.5 ${isEmerald ? "bg-white/5 border-brand" : "bg-brand-surface border-brand"}`}>
              <span className="text-[10px] font-mono-tech uppercase opacity-70 block">
                {activeParent.label}
              </span>
              {activeParent.children.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={() => setDrawerOpen(false)}
                  className="block text-[11px] py-1.5 px-2 rounded-lg hover:bg-brand-primary/15"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Slot */}
      {!isCompactRail && footerSlot && (
        <div className={`pt-4 mt-4 border-t ${isEmerald ? "border-white/10" : "border-brand"}`}>
          {footerSlot}
        </div>
      )}
    </div>
  );

  // Storefront Drawer Mode: Clean Full-Width Page + Slide-Over Drawer Button
  if (asDrawer) {
    return (
      <div className="relative flex-1 w-full">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="fixed left-4 bottom-6 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass-emerald text-white text-xs font-geometric font-bold shadow-2xl hover:scale-105 transition-transform border border-brand"
        >
          <PanelLeft className="w-4 h-4 text-emerald-300" />
          <span>Quick Menu</span>
        </button>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <aside
              className={`relative z-10 ${sidebarWidth} ${
                isFloating ? "m-4 rounded-[30px]" : "rounded-r-[30px]"
              } ${surfaceClass} p-4 overflow-y-auto`}
            >
              {renderSidebarContent()}
            </aside>
          </div>
        )}

        <div className="w-full">{children}</div>
      </div>
    );
  }

  // Admin Docked Sidebar Mode
  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
        isEmerald ? "bg-[#04140e] text-zinc-100" : "bg-[#fff8f7] text-zinc-900"
      }`}
    >
      {/* Mobile Top Bar */}
      <div className={`md:hidden flex items-center justify-between px-4 py-3 border-b ${isEmerald ? "border-brand bg-[#051d15]" : "border-brand bg-white"}`}>
        <div className="flex items-center gap-2.5">
          <img src={logoUrl || "/icon.svg"} alt={brandName} className="w-8 h-8 rounded-xl object-contain" />
          <span className="font-display font-bold text-sm">{brandName}</span>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          className="p-2 rounded-xl bg-black/5 dark:bg-white/10"
        >
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        onMouseEnter={() => styleMode === "expanding" && setHoveredRail(true)}
        onMouseLeave={() => styleMode === "expanding" && setHoveredRail(false)}
        className={`${
          drawerOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden md:flex"
        } ${sidebarWidth} ${
          isFloating ? "md:m-4 md:rounded-[30px]" : "md:rounded-r-[30px]"
        } ${surfaceClass} flex-col p-4 shrink-0 transition-all duration-300 overflow-y-auto`}
      >
        {renderSidebarContent()}
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-5 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
