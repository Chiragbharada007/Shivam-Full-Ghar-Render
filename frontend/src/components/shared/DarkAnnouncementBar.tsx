"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Flower2, Clock, Phone } from "lucide-react";
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
      } catch {}
    };

    loadSettings();

    fetch("/api/site-settings")
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

  const announcement = (
    locale === "gu"
      ? settings.announcementGu
      : locale === "hi"
      ? settings.announcementHi
      : settings.announcementEn
  ).replace(/🌸\s*/g, "");

  return (
    <aside
      aria-label="Store Announcement"
      className="w-full bg-[#163526] text-[#FAF7EF] border-b border-[#D7B77C]/25 text-xs select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-medium truncate">
          <Flower2 className="w-3.5 h-3.5 text-[#D7B77C] shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">{announcement}</span>
        </div>

        <div className="hidden md:flex items-center gap-5 text-[#FAF7EF]/85 text-[11px] shrink-0">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D7B77C]" />
            <span>{settings.openingHours}</span>
          </span>
          <a
            href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 hover:text-[#D7B77C] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#D7B77C]" />
            <span>{settings.contactPhone}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
