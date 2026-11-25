"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { CustomGarlandBuilder } from "@/components/site/CustomGarlandBuilder";

export default function CustomDesignPage() {
  const locale = useLocale();
  const t = useTranslations("customDesign");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string | null>(null);

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newUrls = files.slice(0, 5).map((f) => URL.createObjectURL(f));
      setPhotos((prev) => [...prev, ...newUrls].slice(0, 5));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanMobile = mobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      setError("Please provide a valid 10-digit mobile number");
      return;
    }

    if (!description.trim()) {
      setError("Please describe your custom floral requirements");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerMobile: cleanMobile,
          customerEmail: email || null,
          eventDate: eventDate || null,
          budget: budget ? parseInt(budget, 10) : null,
          description,
          photoUrls: photos,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedRequestNumber(data.requestNumber);
      } else {
        setError(data.message || "Failed to submit request.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyConfig = (config: {
    baseName: string;
    length: string;
    weaveName: string;
    accents: string[];
    estimatedTotal: number;
    referenceImage: string;
  }) => {
    setBudget(config.estimatedTotal.toString());
    const spec = `Custom Varmala Pair Specifications:\n• Flower Theme: ${config.baseName}\n• Length: ${config.length}\n• Weave / Density: ${config.weaveName}\n• Sacred Accents: ${config.accents.length > 0 ? config.accents.join(", ") : "Standard"}\n• Live Calculated Estimate: ₹${config.estimatedTotal.toLocaleString("en-IN")}`;
    setDescription(spec);
    if (!photos.includes(config.referenceImage)) {
      setPhotos((prev) => [config.referenceImage, ...prev].slice(0, 5));
    }
    const formElement = document.getElementById("inquiry-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (submittedRequestNumber) {
    return (
      <div className="py-20 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 min-h-[70vh] flex items-center justify-center px-4 transition-colors">
        <div className="max-w-md w-full rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xl p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-serif font-black text-zinc-900 dark:text-white">
            {t("successTitle")}
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            {t("successDesc")}
          </p>
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white font-mono font-bold text-lg">
            {submittedRequestNumber}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
            {t("trackNotice")}
          </p>
          <div className="pt-2">
            <Link
              href={`/${locale}`}
              className="inline-block px-8 py-3 rounded-2xl bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-xs shadow-md transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-14 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Customised to Your Exact Theme & Reference
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-sans">
            {t("subtitle")}
          </p>
        </div>

        {/* Interactive Custom Garland Builder */}
        <CustomGarlandBuilder onApplyConfig={handleApplyConfig} locale={locale} />

        {/* Formal Custom Request Form */}
        <div id="inquiry-form" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-sm space-y-6 transition-colors">
          <div className="border-b border-black/10 dark:border-white/10 pb-4">
            <h2 className="text-xl font-serif font-black text-zinc-900 dark:text-white">
              Submit Reference & Receive Binding Quotation
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
              Attach sample photos, event date, and specific requests. Our Bhat Simroli master florists will review and issue your itemized quotation within 2 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t("name")} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Shah"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t("mobile")} *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit WhatsApp number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t("eventDate")}
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t("budget")}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t("description")} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about desired garland length, specific roses, carnations, orchids, or theme colours..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Photo Upload Box */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-stone-700">
                  {t("uploadTitle")}
                </label>
                <div className="border-2 border-dashed border-amber-300/80 rounded-2xl p-6 text-center hover:bg-amber-50/50 transition-colors flex flex-col items-center justify-center cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleSimulatePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-amber-700 mb-2 opacity-80" />
                  <span className="text-xs font-semibold text-stone-800">
                    Click to select reference photos
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    PNG, JPG, WebP up to 5MB each (Max 5 photos)
                  </span>
                </div>

                {photos.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {photos.map((src, i) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-xl border border-stone-300 overflow-hidden bg-stone-100 flex items-center justify-center text-xs text-stone-500"
                      >
                        Photo {i + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-900 hover:to-rose-950 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? t("submitting") : t("submitBtn")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
