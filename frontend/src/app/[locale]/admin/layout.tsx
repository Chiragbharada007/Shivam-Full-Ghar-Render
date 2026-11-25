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
  Settings,
  LogOut,
  ExternalLink,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { AdaptiveSidebarShell, SidebarNavItem } from "@/components/shared/AdaptiveSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState<string>("/icon.svg");
  const [shopName, setShopName] = useState<string>("Shivam Admin");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("shivam_site_settings");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
        if (parsed.shopName) setShopName(parsed.shopName);
      }
    } catch {}
  }, []);

  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  const navItems: SidebarNavItem[] = [
    { href: `/${locale}/admin/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    {
      href: `/${locale}/admin/products`,
      label: "Catalog & Store",
      icon: Package,
      children: [
        { href: `/${locale}/admin/products`, label: "Products" },
        { href: `/${locale}/admin/categories`, label: "Categories" },
        { href: `/${locale}/admin/banners`, label: "Home Banners" },
      ],
    },
    { href: `/${locale}/admin/categories`, label: "Categories", icon: Layers },
    { href: `/${locale}/admin/banners`, label: "Home Banners", icon: SlidersHorizontal },
    { href: `/${locale}/admin/pages`, label: "Custom Pages", icon: FileText },
    { href: `/${locale}/admin/visitors`, label: "Visitors & SEO", icon: Users },
    { href: `/${locale}/admin/quotations`, label: "Quotations", icon: FileSpreadsheet },
    { href: `/${locale}/admin/settings`, label: "Settings & Security", icon: Settings },
  ];

  return (
    <AdaptiveSidebarShell
      brandName={shopName}
      brandSubtitle="Emerald & Royal Red • Console"
      logoUrl={logoUrl}
      navItems={navItems}
      currentPath={pathname}
      defaultTheme="emerald-green"
      defaultStyle="floating"
      asDrawer={false}
      footerSlot={
        <div className="space-y-2 text-xs">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-500/15 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </span>
            <span className="text-[10px] font-mono-tech text-emerald-400 font-bold">Live</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = `/${locale}/admin/login`;
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/15 transition-colors font-semibold text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      }
    >
      {children}
    </AdaptiveSidebarShell>
  );
}
