"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send, Calendar } from "lucide-react";

export function ContactInquiryForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (cleanMobile.length !== 10) {
      setError("Please enter a valid 10-digit WhatsApp mobile number.");
      return;
    }
    if (!message.trim()) {
      setError("Please share your floral inquiry details.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerMobile: cleanMobile,
          customerEmail: email.trim() || null,
          eventDate: eventDate || null,
          description: `[Contact Page Inquiry] ${message.trim()}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequestNumber(data.requestNumber);
        setName("");
        setMobile("");
        setEmail("");
        setEventDate("");
        setMessage("");
      } else {
        setError(data.message || "Could not submit your inquiry. Please try WhatsApp below.");
      }
    } catch {
      setError("Network error while sending inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (requestNumber) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-[#244C38]/20 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#244C38]/10 text-[#244C38] flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#163526]">Inquiry Received</h3>
        <p className="text-xs text-[#282A26]/80">
          Reference Number: <strong className="font-mono-tech text-[#9F333E]">{requestNumber}</strong>
        </p>
        <p className="text-xs text-[#282A26]/75 leading-relaxed">
          Our Bhat Simroli florists will reach out on your WhatsApp shortly with availability and fresh flower pricing.
        </p>
        <button
          type="button"
          onClick={() => setRequestNumber(null)}
          className="px-5 py-2.5 rounded-xl bg-[#244C38] text-[#FAF7EF] text-xs font-semibold hover:bg-[#163526] transition-colors"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  const cleanWa = whatsappNumber.replace(/\D/g, "");

  return (
    <div className="p-8 rounded-3xl bg-white border border-[#244C38]/15 shadow-sm space-y-5">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9F333E]">
          Direct Boutique Inquiry
        </span>
        <h3 className="font-serif font-bold text-2xl text-[#163526] mt-1">
          Tell Us About Your Celebration
        </h3>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[#9F333E]/10 border border-[#9F333E]/25 text-[#9F333E] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[#282A26]">Your Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Anand Vora"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-[#244C38]/20 text-[#282A26] placeholder-[#282A26]/45 focus:outline-hidden focus:border-[#244C38]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="font-semibold text-[#282A26]">WhatsApp Mobile *</label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-[#244C38]/20 text-[#282A26] placeholder-[#282A26]/45 focus:outline-hidden focus:border-[#244C38]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[#282A26] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#9F333E]" />
              <span>Event Date</span>
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-[#244C38]/20 text-[#282A26] focus:outline-hidden focus:border-[#244C38]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#282A26]">Email (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-[#244C38]/20 text-[#282A26] placeholder-[#282A26]/45 focus:outline-hidden focus:border-[#244C38]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#282A26]">Floral Requirements *</label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share garland style, car decor, gajra quantity, or preferred flowers..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EF] border border-[#244C38]/20 text-[#282A26] placeholder-[#282A26]/45 focus:outline-hidden focus:border-[#244C38]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-[#244C38] hover:bg-[#163526] text-[#FAF7EF] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? "Sending Inquiry..." : "Submit Inquiry"}</span>
          </button>

          <a
            href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
              `Hello Shivam Full Ghar, I would like to inquire about wedding flowers.${eventDate ? ` Event date: ${eventDate}.` : ""}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl border border-[#244C38]/25 text-[#244C38] hover:bg-[#244C38]/8 font-semibold text-center transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
