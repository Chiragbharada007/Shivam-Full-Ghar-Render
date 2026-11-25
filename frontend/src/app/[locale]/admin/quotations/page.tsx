"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Calendar,
  Phone,
  DollarSign,
  AlertCircle,
  Eye,
  Send,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CustomRequestItem {
  id: string;
  requestNumber: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  eventDate?: string;
  budget?: number; // paise
  description: string;
  photoUrls: string[];
  status: "SUBMITTED" | "REVIEWING" | "QUOTED" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  quotations?: any[];
}

const DEMO_REQUESTS: CustomRequestItem[] = [
  {
    id: "req-1",
    requestNumber: "CRQ-20261112-7821",
    customerName: "Priya Shah & Kunal Parekh",
    customerMobile: "9876543210",
    customerEmail: "priya.kunal@wedding.demo",
    eventDate: "2026-11-25",
    budget: 800000, // ₹8,000
    description: "Looking for 4.5 ft royal red rose and Madurai mogra bud varmala pair, with matching groom sherwani boutonniere and bridal mogra hair veni. Reference photo attached.",
    photoUrls: ["/products/VM-R01.jpg", "/products/HF-01.jpg"],
    status: "QUOTED",
    createdAt: "2026-11-12T10:30:00Z",
    quotations: [
      {
        id: "demo-quo-7821",
        quotationNumber: "QUO-20261112-7821",
        total: 710000,
        status: "ISSUED",
      },
    ],
  },
  {
    id: "req-2",
    requestNumber: "CRQ-20261112-9214",
    customerName: "Jayeshbhai Patel (Bhat Simroli)",
    customerMobile: "9825012345",
    customerEmail: "jayesh.bhatsimroli@gmail.com",
    eventDate: "2026-12-02",
    budget: 1500000, // ₹15,000
    description: "Traditional Gujarat Kathiyawadi wedding. Need 2 grand 5-ft yellow marigold and white tuberose varmalas, 4 classic mogra gajras, and full bonnet car decoration for Baraat procession.",
    photoUrls: ["/products/VM-Y01.jpg", "/products/CR-01.jpg"],
    status: "SUBMITTED",
    createdAt: "2026-11-12T14:15:00Z",
    quotations: [],
  },
];

export default function AdminQuotationsPage() {
  const locale = useLocale();

  const [requests, setRequests] = useState<CustomRequestItem[]>(DEMO_REQUESTS);
  const [selectedReq, setSelectedReq] = useState<CustomRequestItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [issuedQuoId, setIssuedQuoId] = useState<string | null>(null);
  const [issuedQuoNumber, setIssuedQuoNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Builder form state
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "Custom Varmala Pair (4.5 ft) - Red Rose & Fresh Mogra", quantity: 1, unitPrice: 5800 },
    { description: "Matching Groom Rose Boutonniere", quantity: 1, unitPrice: 400 },
    { description: "Bridal Fresh Mogra Hair Veni", quantity: 1, unitPrice: 900 },
  ]);
  const [validDays, setValidDays] = useState(3);
  const [notes, setNotes] = useState("Handcrafted morning of event. Delivery within Bhat Simroli included.");

  // Fetch actual DB custom requests if available
  useEffect(() => {
    fetch("/api/admin/quotations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.requests && data.requests.length > 0) {
          setRequests(data.requests);
        }
      })
      .catch((err) => console.warn("Admin quotations query fallback:", err));
  }, []);

  const totalPaise = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice * 100, 0);
  const totalRupees = totalPaise / 100;
  const advanceAmountRupees = Math.ceil((totalRupees * 40) / 100);

  const openBuilder = (req: CustomRequestItem) => {
    setSelectedReq(req);
    setIssuedQuoId(null);
    setIssuedQuoNumber(null);
    setErrorMsg("");

    // Populate initial items from request description if helpful
    setLineItems([
      { description: `Custom Wedding Garland Pair for ${req.customerName}`, quantity: 1, unitPrice: req.budget ? Math.round((req.budget / 100) * 0.8) : 5500 },
      { description: "Sacred Pearl & Gold Zari Finishing", quantity: 1, unitPrice: 600 },
    ]);
    setIsModalOpen(true);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "Additional Floral Add-on", quantity: 1, unitPrice: 500 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, val: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: val };
    setLineItems(updated);
  };

  const handleIssueQuotation = async () => {
    if (!selectedReq) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customRequestId: selectedReq.id,
          lineItems,
          totalPaise,
          validDays,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIssuedQuoId(data.quotationId);
        setIssuedQuoNumber(data.quotationNumber);

        // Update local status
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedReq.id ? { ...r, status: "QUOTED" } : r
          )
        );
      } else {
        setErrorMsg(data.message || "Failed to create quotation.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const copyQuotationUrl = (quoId: string) => {
    const url = `${window.location.origin}/${locale}/quotation/${quoId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-stone-900">
            Custom Quotations Manager
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review bespoke floral requests, generate itemized quotations, and send client checkout links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>40% Advance Booking Rule Enforced</span>
          </span>
        </div>
      </div>

      {/* Requests Inbox */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-600" />
            <h2 className="text-sm font-bold text-stone-900">Custom Design Inquiries</h2>
          </div>
          <span className="text-xs text-stone-500">{requests.length} Requests</span>
        </div>

        <div className="divide-y divide-stone-100">
          {requests.map((req) => (
            <div key={req.id} className="p-4 sm:p-5 hover:bg-stone-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                    {req.requestNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === "QUOTED"
                      ? "bg-purple-100 text-purple-800"
                      : req.status === "ACCEPTED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {req.status}
                  </span>
                  {req.eventDate && (
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>Event: {req.eventDate}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-700">
                  <span className="font-bold text-stone-900">{req.customerName}</span>
                  <span className="text-stone-500 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>{req.customerMobile}</span>
                  </span>
                  {req.budget && (
                    <span className="text-emerald-800 font-semibold">
                      Budget: {formatPrice(req.budget / 100)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                  {req.description}
                </p>

                {/* Reference Photos */}
                {req.photoUrls && req.photoUrls.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-stone-400 font-medium">References:</span>
                    {req.photoUrls.map((url, i) => (
                      <div key={i} className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200">
                        <Image src={url} alt="Reference" fill className="object-cover" sizes="40px" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0">
                {req.status === "QUOTED" && req.quotations && req.quotations.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyQuotationUrl(req.quotations![0].id)}
                      className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs text-stone-700 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                    </button>
                    <Link
                      href={`/${locale}/quotation/${req.quotations![0].id}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Quotation</span>
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openBuilder(req)}
                    className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Issue Quotation</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quotation Builder Modal */}
      {isModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-rose-800 uppercase">
                  Quotation Builder
                </span>
                <h3 className="text-xl font-serif font-black text-stone-900">
                  Custom Quotation for {selectedReq.customerName}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Request: {selectedReq.requestNumber} · Mobile: {selectedReq.customerMobile}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {issuedQuoId ? (
              /* Success confirmation state */
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-stone-900 text-lg">
                    Quotation Successfully Issued!
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Quotation #{issuedQuoNumber} is live. The client can view items and pay the 40% advance directly online.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => copyQuotationUrl(issuedQuoId)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? "Link Copied!" : "Copy Customer Link"}</span>
                  </button>
                  <Link
                    href={`/${locale}/quotation/${issuedQuoId}`}
                    target="_blank"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Customer View</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Builder form */
              <div className="space-y-5">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Line Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Itemized Floral Breakdown
                    </label>
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {lineItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                          placeholder="Description"
                          className="flex-1 bg-white px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800"
                        />
                        <div className="w-16">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateLineItem(idx, "quantity", parseInt(e.target.value, 10) || 1)}
                            className="w-full bg-white px-2 py-1.5 rounded-lg border border-stone-300 text-xs text-center"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            step={50}
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(idx, "unitPrice", parseInt(e.target.value, 10) || 0)}
                            className="w-full bg-white px-2 py-1.5 rounded-lg border border-stone-300 text-xs text-right font-mono"
                          />
                        </div>
                        <span className="w-20 text-right text-xs font-mono font-bold text-stone-900">
                          {formatPrice(item.quantity * item.unitPrice)}
                        </span>
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLineItem(idx)}
                            className="text-stone-400 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Validity & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Validity (Days)</label>
                    <input
                      type="number"
                      value={validDays}
                      onChange={(e) => setValidDays(parseInt(e.target.value, 10) || 3)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Special Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>
                </div>

                {/* Calculation Summary Box */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(totalRupees)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Delivery Charge (Bhat Simroli)</span>
                    <span className="text-emerald-800 font-bold">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-amber-200 flex justify-between font-serif font-black text-stone-900 text-base">
                    <span>Grand Total</span>
                    <span className="text-rose-900">{formatPrice(totalRupees)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-800 font-bold bg-white/70 p-2 rounded-xl border border-emerald-100">
                    <span>40% Booking Advance Due</span>
                    <span className="font-mono">{formatPrice(advanceAmountRupees)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleIssueQuotation}
                    className="px-6 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? "Generating..." : "Generate & Issue Quotation"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
