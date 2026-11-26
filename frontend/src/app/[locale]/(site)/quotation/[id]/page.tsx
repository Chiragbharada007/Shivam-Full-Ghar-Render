"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageCircle,
  AlertCircle,
  Printer,
} from "lucide-react";
import { formatPrice, formatIST, getPriceDisplay } from "@/lib/utils";

export default function QuotationViewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"ISSUED" | "ACCEPTED" | "REJECTED">("ISSUED");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPrices, setShowPrices] = useState(false);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setShowPrices(Boolean(data.settings.showPrices));
        }
      })
      .catch(() => null);
  }, []);

  // Demo quotation data (resilient to offline DB)
  const quotation = {
    id,
    quotationNumber: id.startsWith("QUO-") ? id : `QUO-20261112-${id.slice(-4).toUpperCase() || "7821"}`,
    customerName: "Auspicious Wedding Client",
    customerMobile: "+91 98765 43210",
    eventDate: "2026-11-25",
    venue: "Bhat Simroli Mandapam, Gujarat",
    validDays: 3,
    items: [
      {
        title: "Custom Royal Lotus Bud & Dutch Red Rose Varmala Pair (4.5 ft)",
        description: "Dense double-layer hand-threading with fragrant Madurai mogra buds and gold zari end-tassels.",
        quantity: 1,
        unitPrice: 5800,
        amount: 5800,
      },
      {
        title: "Matching Groom Sherwani Rose Boutonniere & Safa Brooch",
        description: "Fresh miniature rosebud pinned with pearl wire.",
        quantity: 1,
        unitPrice: 400,
        amount: 400,
      },
      {
        title: "Bridal Fresh Mogra & Rose Petal Hair Veni (Long Braid)",
        description: "100% morning-plucked blossoms for evening ceremony.",
        quantity: 1,
        unitPrice: 900,
        amount: 900,
      },
    ],
    subtotal: 7100,
    deliveryCharge: 0, // Handcrafted in Bhat Simroli Boutique
    total: 7100,
    advanceAmount: 2840, // 40%
    balanceDue: 4260,
  };

  const handleAccept = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/quotations/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("ACCEPTED");
        if (data.whatsappUrl) {
          setTimeout(() => {
            window.location.href = data.whatsappUrl;
          }, 1500);
        }
      } else {
        setErrorMsg(data.message || "Failed to accept quotation.");
        setLoading(false);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Network error");
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/quotations/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason: rejectReason }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("REJECTED");
        setShowRejectModal(false);
      } else {
        setErrorMsg(data.message || "Failed to decline quotation.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-brand-primary dark:text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-brand-primary" />
            <span>Official Floral Quotation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-zinc-900 dark:text-white">
            Custom Wedding Estimate
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
            Prepared with devotion by Shivam Full Ghar master florists in Bhat Simroli.
          </p>
        </div>

        {/* Status Alert Banner */}
        {status === "ACCEPTED" && (
          <div className="p-4 rounded-2xl bg-brand-surface dark:bg-brand-deep/40 border border-brand dark:border-brand text-brand-deep dark:text-brand-primary text-sm font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
              Quotation Accepted! Connecting with our florist on WhatsApp to confirm your booking...
            </span>
            <a
              href={`https://wa.me/919824132014?text=${encodeURIComponent(`Hello Shivam Full Ghar, I accept Quotation #${quotation.quotationNumber}. Please confirm my booking.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-deep text-white text-xs font-bold shrink-0 text-center"
            >
              Open WhatsApp Chat
            </a>
          </div>
        )}

        {status === "REJECTED" && (
          <div className="p-4 rounded-2xl bg-brand-surface dark:bg-brand-deep/40 border border-brand dark:border-brand text-brand-deep dark:text-brand-primary text-sm font-medium flex items-center gap-2">
            <XCircle className="w-5 h-5 text-brand-primary" />
            <span>This quotation has been marked as declined. Feel free to contact our florists on WhatsApp for revised pricing.</span>
          </div>
        )}

        {/* Main Quotation Card */}
        <div className="rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-md p-6 sm:p-8 space-y-6 transition-colors">
          {/* Top Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
            <div>
              <span className="text-xs text-stone-400 font-mono block">Quotation Reference</span>
              <span className="font-serif font-bold text-2xl text-stone-900">
                {quotation.quotationNumber}
              </span>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs text-stone-400 block">Validity</span>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200">
                Valid for {quotation.validDays} days
              </span>
            </div>
          </div>

          {/* Client & Ceremony Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1">
              <span className="font-semibold text-stone-500 uppercase tracking-wider block">
                Prepared For:
              </span>
              <p className="font-bold text-stone-900 text-sm">{quotation.customerName}</p>
              <p className="text-stone-600">{quotation.customerMobile}</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1">
              <span className="font-semibold text-stone-500 uppercase tracking-wider block">
                Ceremony Schedule:
              </span>
              <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-800" />
                {quotation.eventDate}
              </p>
              <p className="text-stone-600">{quotation.venue}</p>
            </div>
          </div>

          {/* Items Breakdown Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3 text-left">Custom Floral Specifications</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {quotation.items.map((item, i) => (
                  <tr key={i} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5">
                      <strong className="block text-stone-900 font-serif text-sm">
                        {item.title}
                      </strong>
                      <span className="text-[11px] text-stone-500 leading-relaxed block mt-0.5">
                        {item.description}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-medium text-stone-700">
                      {item.quantity}
                    </td>
                    <td className="p-3.5 text-right font-serif text-stone-700">
                      {showPrices ? formatPrice(item.unitPrice) : "—"}
                    </td>
                    <td className="p-3.5 text-right font-serif font-bold text-stone-900">
                      {showPrices ? formatPrice(item.amount) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className="pt-2 border-t border-amber-100 space-y-3">
            {showPrices && (
              <div className="flex justify-between text-xs text-stone-600">
                <span>Estimated Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(quotation.subtotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-stone-600">
              <span>Fresh Morning Store Pickup</span>
              <span className="font-semibold text-brand-deep">FREE at Bhat Simroli Boutique</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Grand Total</span>
              <span className={`font-serif ${showPrices ? "text-xl text-brand-deep font-bold" : "text-xs font-semibold text-brand-deep"}`}>
                {getPriceDisplay(quotation.total, showPrices, (locale as any) || "gu", true)}
              </span>
            </div>

            {/* Confirmation & Pickup terms */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
              <span className="font-semibold text-zinc-900 dark:text-white block">
                Booking & Pickup Terms:
              </span>
              <p>
                Once accepted, your order details will be confirmed directly with our florists on WhatsApp. Florals will be handcrafted and made ready for pickup at our Bhat Simroli boutique on your event morning.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          {status === "ISSUED" && (
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {/* Accept & Confirm on WhatsApp Button */}
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-deep)] hover:from-[var(--brand-primary)] hover:to-[var(--brand-deep)] text-white font-bold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4 fill-white text-brand-deep" />
                <span>Accept Quotation & Confirm on WhatsApp</span>
              </button>

              {/* Decline Button */}
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={loading}
                className="px-6 py-4 rounded-2xl border border-stone-300 dark:border-white/20 hover:bg-brand-surface dark:hover:bg-brand-deep/30 hover:border-brand text-stone-700 dark:text-zinc-300 hover:text-brand-deep font-semibold text-xs transition-colors cursor-pointer"
              >
                Decline / Request Change
              </button>
            </div>
          )}

          {/* WhatsApp Direct Negotiation */}
          <div className="pt-2 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400 border-t border-black/10 dark:border-white/10">
            <span>Want custom adjustments or flower changes?</span>
            <a
              href={`https://wa.me/919824132014?text=${encodeURIComponent(`Hello Shivam Full Ghar, regarding Quotation #${quotation.quotationNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-deep dark:text-brand-primary hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Discuss on WhatsApp
            </a>
          </div>
        </div>

        {/* Decline Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Decline Quotation
              </h3>
              <p className="text-xs text-stone-600">
                Please let our florists know why you are declining this estimate so we can adjust our offer:
              </p>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800"
              >
                <option value="">Select a reason...</option>
                <option value="Price out of budget">Estimated price is out of budget</option>
                <option value="Wedding date postponed">Wedding ceremony date has changed</option>
                <option value="Prefer different flower combination">Prefer different flower combination</option>
                <option value="Found alternative vendor">Arranged with another florist</option>
              </select>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-deep text-white text-xs font-bold shadow-xs"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
