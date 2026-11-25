"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export function WhatsAppFloatingButton() {
  const locale = useLocale();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => null);
  }, []);

  if (!settings.showWhatsAppLink) {
    return null;
  }

  const message =
    locale === "gu"
      ? "નમસ્તે શિવમ ફૂલ ઘર, મારે લગ્ન વરમાળા અને તાજા ફૂલો માટે પૂછપરછ કરવી છે."
      : locale === "hi"
      ? "नमस्ते शिवम फूल घर, मुझे विवाह वरमाला और ताजे फूलों की जानकारी चाहिए।"
      : "Hello Shivam Full Ghar, I would like to inquire about wedding varmalas and fresh flowers in Bhat Simroli.";

  const cleanNumber = settings.whatsappNumber.replace(/\D/g, "") || "919824132014";
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Tooltip badge on hover (desktop only) */}
      <div className="hidden sm:flex items-center gap-2 bg-white/95 dark:bg-black/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-emerald-500/30 text-stone-800 dark:text-zinc-200 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
        <span>
          {locale === "gu"
            ? "વોટ્સએપ પર વાત કરો"
            : locale === "hi"
            ? "व्हाट्सएप पर चैट करें"
            : "Chat on WhatsApp"}
        </span>
      </div>

      {/* Main WhatsApp Circular Floating Button (Logo Only, No Number) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl shadow-emerald-950/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
        {/* Subtle Online Pulse Ring */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-stone-900 animate-pulse" />
      </a>
    </aside>
  );
}
