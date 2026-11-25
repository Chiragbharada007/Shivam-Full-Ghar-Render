"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  FileSpreadsheet,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState<string>("/logo.svg");
  const [shopName, setShopName] = useState<string>("Shivam Admin");

  useEffect(() => {
    const load = () => {
      try {
        const cached = localStorage.getItem("shivam_site_settings");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
          if (parsed.shopName) setShopName(parsed.shopName);
        }
      } catch (e) {}
    };
    load();
    window.addEventListener("site-settings-updated", load);
    return () => window.removeEventListener("site-settings-updated", load);
  }, []);

  // If on login page, don't show admin sidebar shell
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  const navItems = [
    { href: `/${locale}/admin/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/${locale}/admin/products`, label: "Products", icon: Package },
    { href: `/${locale}/admin/categories`, label: "Categories", icon: Layers },
    { href: `/${locale}/admin/banners`, label: "Home Banners", icon: SlidersHorizontal },
    { href: `/${locale}/admin/pages`, label: "Custom Pages", icon: FileText },
    { href: `/${locale}/admin/visitors`, label: "Visitors & Analytics", icon: Users },
    { href: `/${locale}/admin/quotations`, label: "Quotations", icon: FileSpreadsheet },
    { href: `/${locale}/admin/settings`, label: "Settings & Demo Reset", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#060606] flex flex-col md:flex-row text-stone-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 p-5 flex flex-col justify-between shrink-0 border-r border-stone-800">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={logoUrl && logoUrl !== "/logo.svg" ? logoUrl : "/icon.svg"}
                  alt={shopName}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-white text-base block leading-tight truncate max-w-[120px]">
                  {shopName}
                </span>
                <span className="text-[10px] text-amber-400 font-mono block">
                  Bhat Simroli Boutique
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? "bg-rose-900 text-white font-semibold"
                      : "text-stone-400 hover:text-white hover:bg-stone-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-stone-800 space-y-2 text-xs">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Live</span>
          </Link>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = `/${locale}/admin/login`;
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors font-medium text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
