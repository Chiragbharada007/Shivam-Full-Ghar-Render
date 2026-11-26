"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Set cookie NEXT_LOCALE with 1 year max-age
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Replace the current locale prefix in the pathname
    const segments = pathname.split("/");
    if (segments[1] && ["gu", "hi", "en"].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || `/${newLocale}`;
    const search = typeof window !== "undefined" ? window.location.search : "";
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.push(`${newPath}${search}${hash}`);
  };

  const languages = [
    { code: "gu", label: "ગુજરાતી" },
    { code: "hi", label: "हिन्दी" },
    { code: "en", label: "English" },
  ];

  return (
    <div className="flex items-center gap-1 text-xs sm:text-sm font-medium bg-amber-50/80 border border-amber-200/60 rounded-full px-2 py-1">
      <Globe className="w-3.5 h-3.5 text-brand-deep" />
      <div className="flex items-center divide-x divide-amber-200">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-1.5 py-0.5 rounded-full transition-all ${
              currentLocale === lang.code
                ? "bg-brand-deep text-white font-semibold shadow-xs"
                : "text-stone-700 hover:text-brand-deep hover:bg-amber-100/60"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
