// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price in Indian Rupees with Indian grouping (₹1,00,000) */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Return formatted price if showPrices is ON, otherwise return localized "Price on request" text.
 * P8-T07 Requirement:
 * When OFF: "Price on request – WhatsApp us" (quotation: "Price will be shared on WhatsApp")
 */
export function getPriceDisplay(
  amount: number,
  showPrices: boolean,
  locale: "gu" | "hi" | "en" = "gu",
  isQuotation: boolean = false
): string {
  if (showPrices) {
    return formatPrice(amount);
  }
  if (isQuotation) {
    if (locale === "gu") return "ભાવ વોટ્સએપ પર જણાવવામાં આવશે";
    if (locale === "hi") return "कीमत व्हाट्सएप पर साझा की जाएगी";
    return "Price will be shared on WhatsApp";
  }
  if (locale === "gu") return "કિંમત જાણવા વોટ્સએપ કરો";
  if (locale === "hi") return "कीमत के लिए व्हाट्सएप करें";
  return "Price on request – WhatsApp us";
}

/** Calculate advance amount based on percentage */
export function calcAdvance(total: number, advancePct: number): number {
  return Math.ceil((total * advancePct) / 100);
}

/** Format date/time in IST */
export function formatIST(date: Date): string {
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
