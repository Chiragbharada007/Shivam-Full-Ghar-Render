"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { UploadCloud, CheckCircle2, ArrowRight, AlertCircle, X } from "lucide-react";
import { CustomGarlandBuilder } from "@/components/site/CustomGarlandBuilder";

export default function CustomDesignPage() {
  const locale = useLocale();
  const t = useTranslations("customDesign");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("Wedding Varmala");
  const [flowers, setFlowers] = useState("Dutch Roses & Madurai Mogra");
  const [colors, setColors] = useState("Crimson Red & Ivory White");
  const [quantity, setQuantity] = useState("1 Pair");
  const [fulfillment, setFulfillment] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 5) : [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Each reference image must be under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotos((prev) => [...prev, reader.result as string].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (cleanMobile.length !== 10) {
      setError("Please provide a valid 10-digit WhatsApp mobile number.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe your custom floral requirements.");
      return;
    }

    setIsSubmitting(true);
    const fullDescription = [
      `Event Type: ${eventType}`,
      `Required Flowers: ${flowers}`,
      `Color Preferences: ${colors}`,
      `Quantity: ${quantity}`,
      `Fulfillment: ${fulfillment === "PICKUP" ? "Bhat Simroli Store Pickup" : "Local Delivery"}`,
      `Notes: ${description.trim()}`,
    ].join("\n");

    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerMobile: cleanMobile,
          eventDate: eventDate || null,
          budget: budget ? parseInt(budget, 10) : null,
          description: fullDescription,
          photoUrls: photos,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedRequestNumber(data.requestNumber);
      } else {
        setError(data.message || "Failed to submit custom request.");
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
    setFlowers(config.baseName);
    setDescription(
      `Custom Varmala Pair:\n• Length: ${config.length}\n• Weave: ${config.weaveName}\n• Accents: ${
        config.accents.length > 0 ? config.accents.join(", ") : "Standard"
      }\n• Live Estimate: ₹${config.estimatedTotal.toLocaleString("en-IN")}`
    );
    if (config.referenceImage && !photos.includes(config.referenceImage)) {
      setPhotos((prev) => [config.referenceImage, ...prev].slice(0, 5));
    }
    document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" });
  };

  if (submittedRequestNumber) {
    return (
      <div className="py-20 bg-[#FAF7EF] text-[#282A26] min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl bg-white border border-brand shadow-md p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-deep">{t("successTitle")}</h2>
          <p className="text-xs text-[#282A26]/75 leading-relaxed">{t("successDesc")}</p>
          <div className="p-4 rounded-2xl bg-[#FAF7EF] border border-brand text-brand-primary font-mono-tech font-bold text-lg">
            {submittedRequestNumber}
          </div>
          <p className="text-xs text-[#282A26]/70">{t("trackNotice")}</p>
          <Link
            href={`/${locale}`}
            className="inline-block px-8 py-3 rounded-xl bg-brand-primary hover:bg-brand-deep text-[#FAF7EF] font-semibold text-xs transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-14 px-3 sm:px-6 bg-transparent text-[#282A26] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 rounded-3xl bg-white/88 backdrop-blur-md border border-white/25 shadow-2xl">
        <div className="text-center space-y-2.5">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-widest">
            Bespoke Indian Wedding Florals
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-deep">{t("title")}</h1>
          <p className="text-sm text-[#282A26]/75 max-w-xl mx-auto leading-relaxed">{t("subtitle")}</p>
        </div>

        <CustomGarlandBuilder onApplyConfig={handleApplyConfig} locale={locale} />

        <div id="inquiry-form" className="p-6 sm:p-8 rounded-3xl bg-white border border-brand shadow-sm space-y-6">
          <div className="border-b border-brand pb-4">
            <h2 className="text-2xl font-serif font-bold text-brand-deep">
              Submit Custom Floral Inquiry
            </h2>
            <p className="text-xs text-[#282A26]/70 mt-1">
              Share your event details and reference photos. Our Bhat Simroli florists will prepare your custom quotation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-brand-primary/10 border border-[#9F333E]/25 text-brand-primary font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-brand-deep">{t("name")} *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Shah"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-brand-deep">{t("mobile")} *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit WhatsApp number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-brand-deep">{t("eventDate")}</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-brand-deep">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                >
                  <option>Wedding Varmala</option>
                  <option>Bridal Hair Veni & Gajra</option>
                  <option>Haldi / Mehndi Floral Jewellery</option>
                  <option>Car Decoration</option>
                  <option>Complete Wedding Package</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-brand-deep">Required Flowers</label>
                <input
                  type="text"
                  value={flowers}
                  onChange={(e) => setFlowers(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-brand-deep">Color Preferences</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-brand-deep">Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 1 Pair / 10 Gajras"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-brand-deep">{t("budget")} (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-brand-deep block">Delivery or Store Pickup</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillment("PICKUP")}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-semibold border transition-colors ${
                      fulfillment === "PICKUP"
                        ? "bg-brand-primary text-[#FAF7EF] border-brand"
                        : "bg-[#FAF7EF] text-[#282A26] border-brand"
                    }`}
                  >
                    Free Bhat Simroli Store Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillment("DELIVERY")}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-semibold border transition-colors ${
                      fulfillment === "DELIVERY"
                        ? "bg-brand-primary text-[#FAF7EF] border-brand"
                        : "bg-[#FAF7EF] text-[#282A26] border-brand"
                    }`}
                  >
                    Local Event Delivery
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-brand-deep">{t("description")} *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share garland length, ceremony timing, or special floral notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-brand text-[#282A26] focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="font-semibold text-brand-deep">{t("uploadTitle")}</label>
                <div className="border-2 border-dashed border-[#D7B77C] rounded-2xl p-6 text-center hover:bg-[#FAF7EF] transition-colors flex flex-col items-center justify-center cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-brand-primary mb-2" />
                  <span className="font-semibold text-brand-deep">Click to select reference photos</span>
                  <span className="text-[11px] text-[#282A26]/60 mt-1">
                    PNG, JPG, WebP up to 5MB each (Max 5 photos)
                  </span>
                </div>

                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {photos.map((src, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl border border-brand overflow-hidden">
                        <img src={src} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-brand-deep text-white"
                          aria-label="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-deep text-[#FAF7EF] font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? t("submitting") : t("submitBtn")}</span>
              <ArrowRight className="w-4 h-4 text-[#D7B77C]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
