"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Sparkles, Phone, Clock } from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export function AnnouncementBar() {
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

  const announcement =
    locale === "gu"
      ? settings.announcementGu
      : locale === "hi"
      ? settings.announcementHi
      : settings.announcementEn;

  return (
    <div className="bg-gradient-to-r from-amber-700 via-rose-800 to-amber-700 text-amber-50 text-xs sm:text-sm py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-medium truncate">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
          <span className="truncate">{announcement}</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-amber-100 shrink-0 text-xs">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {settings.openingHours}
          </span>
          <a
            href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> {settings.contactPhone}
          </a>
        </div>
      </div>
    </div>
  );
}
