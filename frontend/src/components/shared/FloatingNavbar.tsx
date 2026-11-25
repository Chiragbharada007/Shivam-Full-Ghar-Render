"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Search,
  Menu,
  X,
  ChevronRight,
  Lock,
} from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export function FloatingNavbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);

  // Sync settings (including uploaded logo)
  useEffect(() => {
    const loadSettings = () => {
      try {
        const cached = localStorage.getItem("shivam_site_settings");
        if (cached) {
          setSiteSettings((prev) => ({ ...prev, ...JSON.parse(cached) }));
        }
      } catch (e) {}
    };

    loadSettings();

    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSiteSettings((prev) => {
            const serverLogo = data.settings.logoUrl;
            const effectiveLogo =
              prev.logoUrl && prev.logoUrl !== "/logo.svg" && (!serverLogo || serverLogo === "/logo.svg")
                ? prev.logoUrl
                : serverLogo || prev.logoUrl;

            const merged = { ...prev, ...data.settings, logoUrl: effectiveLogo };
            try {
              localStorage.setItem("shivam_site_settings", JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => null);

    window.addEventListener("site-settings-updated", loadSettings);
    return () => window.removeEventListener("site-settings-updated", loadSettings);
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // P8-T15 Clean Menu: Home, Collections, Wedding Packages, Custom Design, Gallery, About, Contact
  const navLinks = [
    {
      href: `/${locale}`,
      label: locale === "gu" ? "હોમ" : locale === "hi" ? "होम" : "Home",
    },
    {
      href: `/${locale}/shop`,
      label: locale === "gu" ? "કલેક્શન" : locale === "hi" ? "कलेक्शन" : "Collections",
    },
    {
      href: `/${locale}/packages`,
      label: locale === "gu" ? "લગ્ન પેકેજ" : locale === "hi" ? "विवाह पैकेज" : "Wedding Packages",
    },
    {
      href: `/${locale}/custom-design`,
      label: locale === "gu" ? "કસ્ટમ ડિઝાઇન" : locale === "hi" ? "कस्टम डिज़ाइन" : "Custom Design",
    },
    {
      href: `/${locale}/gallery`,
      label: locale === "gu" ? "ગેલેરી" : locale === "hi" ? "गैलरी" : "Gallery",
    },
    {
      href: `/${locale}/about`,
      label: locale === "gu" ? "અમારા વિશે" : locale === "hi" ? "हमारे बारे में" : "About",
    },
    {
      href: `/${locale}/contact`,
      label: locale === "gu" ? "સંપર્ક" : locale === "hi" ? "संपर्क" : "Contact",
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  const rawDigits = siteSettings.whatsappNumber.replace(/\D/g, "") || "9824132014";
  const phoneDigits = rawDigits.startsWith("91") && rawDigits.length === 12 ? rawDigits : `91${rawDigits.slice(-10)}`;
  const tenDigits = rawDigits.slice(-10);
  const formattedDisplay = `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;

  const readyWhatsAppMessage =
    locale === "gu"
      ? "નમસ્તે શિવમ ફૂલ ઘર ભાટ સિમરોલી, મારે તાજા ફૂલો અને લગ્ન વરમાળા વિશે પૂછપરછ કરવી છે."
      : locale === "hi"
      ? "नमस्ते शिवम फूल घर भाट सिमरौली, मुझे ताजे फूल और विवाह वरमाला के बारे में पूछताछ करनी है।"
      : "Hello Shivam Full Ghar Bhat Simroli, I want to inquire about fresh wedding flowers and garlands.";

  return (
    <>
      <nav aria-label="Main Navigation" className="sticky top-2 sm:top-4 z-40 px-2 sm:px-6 w-full pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto rounded-full backdrop-blur-xl bg-white/85 dark:bg-[#060606]/90 border border-black/10 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-2.5 sm:px-5 py-2 transition-colors duration-300 gap-2">
          {/* Logo & Header WhatsApp next to the logo on the left (P8-T14) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 group shrink-0 focus:outline-hidden"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/15 flex items-center justify-center group-hover:border-rose-500/60 transition-colors shrink-0">
                <Image
                  src={
                    siteSettings.logoUrl && siteSettings.logoUrl !== "/logo.svg"
                      ? siteSettings.logoUrl
                      : "/icon.svg"
                  }
                  alt={siteSettings.shopName || "Shivam Full Ghar"}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xs sm:text-base text-zinc-900 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors leading-none truncate max-w-[105px] sm:max-w-none">
                  {locale === "gu" ? siteSettings.shopNameGu || "શિવમ ફૂલ ઘર" : siteSettings.shopName || "Shivam Full Ghar"}
                </span>
                <span className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-sans tracking-widest uppercase">
                  {locale === "gu" ? "ભાટ સિમરોલી" : "Bhat Simroli"}
                </span>
              </div>
            </Link>

            {/* WhatsApp Circular Logo Button Next to Logo (Icon Only, No Number) */}
            <a
              href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(readyWhatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              title="Chat with Shivam Full Ghar on WhatsApp"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-md shadow-emerald-950/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            </a>
          </div>

          {/* Desktop Nav Links (Clean Menu: Home, Collections, Packages, Custom Design, Gallery, About, Contact) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    active
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30 shadow-2xs"
                      : "font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side: Search + Theme Toggle + Language + Admin Login + Mobile Toggle */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Search Pill (⌘K) on large screens, icon button on small screens */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200 text-xs transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span className="font-normal">
                {locale === "gu" ? "શોધો..." : "Search..."}
              </span>
              <kbd className="inline-flex items-center rounded px-1 text-[9px] font-mono text-zinc-500 bg-black/5 dark:bg-white/10">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="xl:hidden p-1.5 sm:p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Sleek Admin Portal Link */}
            <Link
              href={`/${locale}/admin/dashboard`}
              title="Admin Login"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 text-[11px] font-semibold tracking-tight transition-all active:scale-95 border border-black/10 dark:border-white/10"
            >
              <Lock className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              <span>{locale === "gu" ? "એડમિન" : "Login"}</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Glass Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl backdrop-blur-2xl bg-white/95 dark:bg-[#060606]/95 border border-black/10 dark:border-white/10 p-4 sm:p-5 shadow-2xl pointer-events-auto flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold font-mono">
                {locale === "gu" ? "મેનુ નેવિગેશન" : "Menu Navigation"}
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Links List with Active State */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between ${
                      active
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/25"
                        : "font-medium text-zinc-800 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${active ? "text-rose-600 dark:text-rose-400" : "text-zinc-400"}`} />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Direct WhatsApp Button */}
            <a
              href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(readyWhatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>{locale === "gu" ? "વોટ્સએપ પર વાત કરો" : locale === "hi" ? "व्हाट्सएप पर बात करें" : "Chat on WhatsApp"}</span>
            </a>

            {/* Mobile Admin Link */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-zinc-500">
              <span>{siteSettings.shopName}</span>
              <Link
                href={`/${locale}/admin/dashboard`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Global Keyboard / Multilingual Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        locale={locale}
      />
    </>
  );
}
