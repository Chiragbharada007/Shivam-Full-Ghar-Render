"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  Truck,
  Globe,
} from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/shared/SocialIcons";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("common");
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [customPages, setCustomPages] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.pages)) {
          setCustomPages(data.pages.filter((p: any) => p.showInFooter));
        }
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const cached = localStorage.getItem("shivam_site_settings");
        if (cached) {
          setSettings((prev) => ({ ...prev, ...JSON.parse(cached) }));
        }
      } catch (e) {}
    };

    loadSettings();

    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => {
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

  return (
    <footer className="bg-[#163526] text-[#FAF7EF]/90 pt-16 pb-12 border-t border-[#D7B77C]/25 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-[#FAF7EF]/15">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#244C38]/60 border border-[#D7B77C]/25">
            <div className="w-12 h-12 rounded-xl bg-[#9F333E]/25 border border-[#D7B77C]/30 flex items-center justify-center text-[#D7B77C] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-[#FAF7EF] text-sm">
                {(locale === "gu" ? settings.trust1Gu : locale === "hi" ? settings.trust1Hi : settings.trust1En) || "100% Fresh Morning Flowers"}
              </h4>
              <p className="text-xs text-[#FAF7EF]/75 mt-0.5">
                Plucked fresh daily and handcrafted morning of your event.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#244C38]/60 border border-[#D7B77C]/25">
            <div className="w-12 h-12 rounded-xl bg-[#D7B77C]/20 border border-[#D7B77C]/30 flex items-center justify-center text-[#D7B77C] shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-[#FAF7EF] text-sm">
                {(locale === "gu" ? settings.trust2Gu : locale === "hi" ? settings.trust2Hi : settings.trust2En) || "Free Store Pickup at Bhat Simroli Shop"}
              </h4>
              <p className="text-xs text-[#FAF7EF]/75 mt-0.5">
                {settings.address || "Shivam Full Ghar, Bhat Simroli, Gujarat"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#244C38]/60 border border-[#D7B77C]/25">
            <div className="w-12 h-12 rounded-xl bg-[#244C38] border border-[#D7B77C]/30 flex items-center justify-center text-[#D7B77C] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-[#FAF7EF] text-sm">
                {(locale === "gu" ? settings.trust3Gu : locale === "hi" ? settings.trust3Hi : settings.trust3En) || "Boutique Quality Guarantee · Photo Preview on WhatsApp"}
              </h4>
              <p className="text-xs text-[#FAF7EF]/75 mt-0.5">
                Handcrafted fresh to order by local florists with photo preview on WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-black/10 dark:border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="relative h-12 w-48 flex items-center">
              <img
                src={settings.logoUrl || "/logo.svg"}
                alt="Shivam Full Ghar"
                className="h-12 w-auto max-w-[190px] object-contain object-left"
              />
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {(locale === "gu" ? settings.footerAboutGu : locale === "hi" ? settings.footerAboutHi : settings.footerAboutEn) ||
                "Premium fresh wedding garlands (વરમાળા), bridal hair veni, gajra, car bouquet decoration and authentic floral jewellery in Bhat Simroli, Saurashtra, Gujarat."}
            </p>
            <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {settings.shopNameGu} • ભાટ સિમરોલી, ગુજરાત
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-black/5 hover:bg-pink-100 text-zinc-700 hover:text-pink-600 dark:bg-white/5 dark:border dark:border-white/10 dark:hover:bg-pink-900/60 dark:text-zinc-300 dark:hover:text-white flex items-center justify-center transition-colors border border-black/10"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-black/5 hover:bg-blue-100 text-zinc-700 hover:text-blue-600 dark:bg-white/5 dark:border dark:border-white/10 dark:hover:bg-blue-900/60 dark:text-zinc-300 dark:hover:text-white flex items-center justify-center transition-colors border border-black/10"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-black/5 hover:bg-red-100 text-zinc-700 hover:text-red-600 dark:bg-white/5 dark:border dark:border-white/10 dark:hover:bg-red-900/60 dark:text-zinc-300 dark:hover:text-white flex items-center justify-center transition-colors border border-black/10"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-black/5 hover:bg-amber-100 text-zinc-700 hover:text-amber-600 dark:bg-white/5 dark:border dark:border-white/10 dark:hover:bg-amber-900/60 dark:text-zinc-300 dark:hover:text-white flex items-center justify-center transition-colors border border-black/10"
                  aria-label="Google Maps Location"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider font-serif">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/shop`} className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Fresh Garlands & Shop
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/packages`} className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Wedding Combo Packages
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/custom-design`} className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Custom Design Request
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/gallery`} className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Real Wedding Floral Gallery
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Shop Location & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider font-serif">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/about`} className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  About Our Florists
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Wedding Flower Guides & Blog
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Contact & Venue Inquiry
                </Link>
              </li>
              {customPages.map((cp) => (
                <li key={cp.slug}>
                  <Link
                    href={`/${locale}/pages/${cp.slug}`}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    {cp.title[locale] || cp.title.en || cp.title.gu}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/admin/login`} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider font-serif">
              Visit or Call Us
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
                <a href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Open Everyday: {settings.openingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            {(locale === "gu"
              ? settings.footerCopyrightGu
              : locale === "hi"
              ? settings.footerCopyrightHi
              : settings.footerCopyrightEn) ||
              `© ${new Date().getFullYear()} ${settings.shopName}. ${t("allRightsReserved")}`}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/about`} className="hover:text-zinc-700 dark:hover:text-zinc-400">
              Privacy & Shop Terms
            </Link>
            <span>•</span>
            <span>Crafted with devotion in Bhat Simroli 🌺</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
