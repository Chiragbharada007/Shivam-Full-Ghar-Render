"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  FileSpreadsheet,
  Image as ImageIcon,
  Star,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Users,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopName, setShopName] = useState("Shivam Admin");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("shivam_site_settings");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.shopName) setShopName(parsed.shopName);
      }
    } catch {}
  }, []);

  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  const navItems = [
    { href: `/${locale}/admin/dashboard`, label: "Overview", icon: LayoutDashboard },
    { href: `/${locale}/admin/orders`, label: "Orders", icon: ShoppingBag },
    { href: `/${locale}/admin/products`, label: "Products", icon: Package },
    { href: `/${locale}/admin/categories`, label: "Categories", icon: Layers },
    { href: `/${locale}/admin/quotations`, label: "Custom Inquiries", icon: FileSpreadsheet },
    { href: `/${locale}/admin/banners`, label: "Homepage Content", icon: ImageIcon },
    { href: `/${locale}/admin/pages`, label: "Custom Pages", icon: FileText },
    { href: `/${locale}/admin/visitors`, label: "Visitors & SEO", icon: Users },
    { href: `/${locale}/admin/delivery`, label: "Pickup & Slots", icon: Star },
    { href: `/${locale}/admin/settings`, label: "Business Settings", icon: Settings },
  ];

  const SidebarBody = () => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-xl bg-[#244C38] border border-[#D7B77C]/50 flex items-center justify-center shrink-0">
            <img src="/icon.svg" alt={shopName} className="w-7 h-7 object-contain" />
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold text-base text-[#FAF7EF] block truncate">
              {shopName}
            </span>
            <span className="text-[10px] text-[#D7B77C] font-mono-tech block truncate">
              Bhat Simroli • Console
            </span>
          </div>
        </div>

        <nav className="space-y-1 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#9F333E] text-[#FAF7EF] font-semibold"
                    : "text-[#FAF7EF]/80 hover:text-[#FAF7EF] hover:bg-[#244C38]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[#FAF7EF]/15 space-y-2 text-xs">
        <Link
          href={`/${locale}`}
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[#FAF7EF]/80 hover:bg-[#244C38] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </span>
          <span className="text-[10px] text-[#D7B77C] font-mono-tech">Live</span>
        </Link>

        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = `/${locale}/admin/login`;
          }}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-[#D7B77C] hover:bg-[#9F333E]/30 transition-colors font-semibold text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF7EF] text-[#282A26]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#163526] text-[#FAF7EF]">
        <div className="flex items-center gap-2.5">
          <img src="/icon.svg" alt={shopName} className="w-8 h-8 rounded-lg" />
          <span className="font-serif font-bold text-base">{shopName}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded-lg bg-[#244C38]"
          aria-label="Toggle Admin Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden md:flex"
        } w-64 bg-brand-deep text-[#FAF7EF] p-5 flex-col shrink-0 border-r border-[#D7B77C]/20 transition-colors duration-300`}
      >
        <div className="mb-3 flex justify-end">
          <ThemeToggle />
        </div>
        <SidebarBody />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-5 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
