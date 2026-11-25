"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Home, ShoppingBag, Sparkles, Package, Image as ImageIcon, Phone, Compass, ShieldCheck } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppFloatingButton } from "@/components/shared/WhatsAppFloatingButton";
import { ShrinkHeaderWrapper } from "@/components/shared/ScrollEffects";
import { AdaptiveSidebarShell, SidebarNavItem } from "@/components/shared/AdaptiveSidebar";
import { LayersBackground } from "@/components/shared/LayersBackground";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();

  const siteNavItems: SidebarNavItem[] = [
    { href: `/${locale}`, label: "Home Studio", icon: Home },
    {
      href: `/${locale}/shop`,
      label: "Floral Shop",
      icon: ShoppingBag,
      children: [
        { href: `/${locale}/shop?category=garlands`, label: "Wedding Varmala" },
        { href: `/${locale}/shop?category=car-decoration`, label: "Car Decor" },
        { href: `/${locale}/shop?category=gajra`, label: "Mogra Gajra" },
      ],
    },
    { href: `/${locale}/custom-design`, label: "Custom Builder", icon: Sparkles },
    { href: `/${locale}/packages`, label: "Wedding Packages", icon: Package },
    { href: `/${locale}/gallery`, label: "Gallery", icon: ImageIcon },
    { href: `/${locale}/track`, label: "Track Order", icon: Compass },
    { href: `/${locale}/contact`, label: "Contact Boutique", icon: Phone },
    { href: `/${locale}/admin/login`, label: "Admin Console", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf9f6] text-zinc-900 dark:bg-[#04100b] dark:text-zinc-100 transition-colors duration-300 relative">
      <LayersBackground />

      <ShrinkHeaderWrapper className="sticky top-0 z-40 relative">
        <Header />
      </ShrinkHeaderWrapper>

      <AdaptiveSidebarShell
        brandName="Shivam Full Ghar"
        brandSubtitle="Emerald & Royal Red • Keshod"
        logoUrl="/icon.svg"
        navItems={siteNavItems}
        currentPath={pathname}
        defaultTheme="emerald-green"
        defaultStyle="floating"
        asDrawer={true}
      >
        <main className="flex-1 w-full relative z-10">{children}</main>
      </AdaptiveSidebarShell>

      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
