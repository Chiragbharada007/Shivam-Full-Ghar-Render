// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["gu", "hi", "en"],
  defaultLocale: "gu",
  localePrefix: "always",
  localeDetection: true,
});
