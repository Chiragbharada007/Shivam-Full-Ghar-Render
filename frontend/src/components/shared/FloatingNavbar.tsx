"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Search, Menu, X, ShoppingBag, Flower2, Home, Sparkles, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export function FloatingNavbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const syncCart = () => {
      try {
        const raw = localStorage.getItem("shivam_cart");
        if (raw) {
          const parsed = JSON.parse(raw);
          setCartCount(Array.isArray(parsed) ? parsed.reduce((acc, i) => acc + (i.quantity || 1), 0) : 0);
        }
      } catch {}
    };
    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("cart-updated", syncCart);

    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSiteSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => null);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cart-updated", syncCart);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: locale === "gu" ? "હોમ" : locale === "hi" ? "होम" : "Home" },
    { href: `/${locale}/shop`, label: locale === "gu" ? "શોપ" : locale === "hi" ? "शॉप" : "Shop" },
    { href: `/${locale}/packages`, label: locale === "gu" ? "લગ્ન પેકેજ" : locale === "hi" ? "विवाह पैकेज" : "Wedding Packages" },
    { href: `/${locale}/custom-design`, label: locale === "gu" ? "કસ્ટમ ઓર્ડર" : locale === "hi" ? "कस्टम ऑर्डर" : "Custom Orders" },
    { href: `/${locale}/gallery`, label: locale === "gu" ? "ગેલેરી" : locale === "hi" ? "गैलरी" : "Gallery" },
    { href: `/${locale}/about`, label: locale === "gu" ? "અમારા વિશે" : locale === "hi" ? "हमारे बारे में" : "About" },
    { href: `/${locale}/contact`, label: locale === "gu" ? "સંપર્ક" : locale === "hi" ? "संपर्क" : "Contact" },
  ];

  return (
    <>
      <nav
        aria-label="Primary Navigation"
        className="w-full bg-[#FAF7EF]/95 backdrop-blur-md border-b border-[#244C38]/12 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-primary border border-[#D7B77C]/60 flex items-center justify-center overflow-hidden shadow-xs">
              <img src="/icon.svg" alt={siteSettings.shopName} className="w-8 h-8 object-contain" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-brand-deep leading-none block">
                {locale === "gu" ? siteSettings.shopNameGu : locale === "hi" ? siteSettings.shopNameHi : siteSettings.shopName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-brand-primary font-semibold block mt-0.5">
                Bhat Simroli • Keshod
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (CodeXr Glassy Sliding Pill) */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-brand-surface/70 border border-brand">
            {navLinks.map((link) => {
              const isActive =
                link.href === `/${locale}`
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isActive ? "text-[#FAF7EF]" : "text-[#282A26] hover:text-brand-primary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navActivePill"
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                      className="absolute inset-0 rounded-full bg-brand-primary -z-0"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search flowers"
              className="p-2 rounded-lg border border-brand text-brand-primary hover:bg-brand-surface transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href={`/${locale}/cart`}
              aria-label="Shopping Bag"
              className="relative p-2 rounded-lg border border-brand text-brand-primary hover:bg-brand-surface transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-deep text-[#FAF7EF] text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <LanguageSwitcher />

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2 rounded-lg border border-[#244C38]/15 text-[#244C38]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#244C38]/15 bg-[#FAF7EF] px-4 py-4 space-y-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === `/${locale}`
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive
                      ? "bg-[#244C38] text-[#FAF7EF]"
                      : "text-[#282A26] hover:bg-[#244C38]/8"
                  }`}
                >
                  <Flower2 className="w-4 h-4 text-[#9F333E]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Quick Dock */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl bg-[#FAF7EF]/95 backdrop-blur-md border border-brand shadow-lg px-3 py-2 flex items-center justify-around text-[11px] font-semibold">
        <Link href={`/${locale}`} className="flex flex-col items-center gap-0.5 text-brand-deep">
          <Home className="w-4 h-4 text-brand-primary" />
          <span>Home</span>
        </Link>
        <Link href={`/${locale}/shop`} className="flex flex-col items-center gap-0.5 text-brand-deep">
          <ShoppingBag className="w-4 h-4 text-brand-primary" />
          <span>Shop</span>
        </Link>
        <Link href={`/${locale}/custom-design`} className="flex flex-col items-center gap-0.5 text-brand-deep">
          <Sparkles className="w-4 h-4 text-brand-primary" />
          <span>Custom</span>
        </Link>
        <a
          href={`https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-brand-deep"
        >
          <MessageCircle className="w-4 h-4 text-brand-primary" />
          <span>WhatsApp</span>
        </a>
      </div>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />
    </>
  );
}
