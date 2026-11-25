"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Sparkles, Clock, Phone } from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export function DarkAnnouncementBar() {
  const locale = useLocale();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

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

    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => null);

    window.addEventListener("site-settings-updated", loadSettings);
    return () => window.removeEventListener("site-settings-updated", loadSettings);
  }, []);

  const announcement =
    locale === "gu"
      ? settings.announcementGu
      : locale === "hi"
      ? settings.announcementHi
      : settings.announcementEn;

  return (
    <aside
      aria-label="Store Announcement"
      className="w-full bg-[#faf9f6] text-zinc-900 border-b border-black/10 dark:bg-[#060606] dark:text-white dark:border-white/10 text-xs font-sans select-none relative z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        {/* Left: Store Announcement Notice */}
        <div className="flex items-center gap-2 font-medium truncate">
          <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="text-zinc-800 dark:text-zinc-200 truncate text-[11px] sm:text-xs">
            {announcement}
          </span>
        </div>

        {/* Right: Opening Hours & Contact */}
        <div className="hidden sm:flex items-center gap-4 text-zinc-600 dark:text-zinc-400 text-[11px] shrink-0 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{settings.openingHours}</span>
          </span>
          <span className="text-zinc-400 dark:text-zinc-700">|</span>
          <a
            href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{settings.contactPhone}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
