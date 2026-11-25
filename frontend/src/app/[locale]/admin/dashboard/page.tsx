import Link from "next/link";
import { cookies } from "next/headers";
import { gatewayFetch } from "@/lib/gateway";
import { formatPrice, formatIST } from "@/lib/utils";
import {
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Package,
  ChevronRight,
  MessageCircle,
  Calendar,
  MapPin,
  Globe,
  Mail,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let totalRequests = 0;
  let pendingRequests = 0;
  let totalQuotations = 0;
  let acceptedQuotations = 0;
  let totalProducts = 0;
  let recentRequests: any[] = [];
  let recentVisits: any[] = [];
  let visitsToday = 0;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sfg_admin_token")?.value;
    const data = await gatewayFetch<any>("/api/admin/dashboard", {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (data?.success) {
      totalRequests = data.kpis?.totalRequests || 0;
      totalQuotations = data.kpis?.totalQuotations || 0;
      acceptedQuotations = data.kpis?.acceptedQuotations || 0;
      totalProducts = data.kpis?.totalProducts || 0;
      recentRequests = data.recentRequests || [];
      recentVisits = data.recentVisits || [];
      pendingRequests = recentRequests.filter((r: any) => r.status === "SUBMITTED").length;
    }
  } catch (e) {
    console.error("Dashboard metrics error:", e);
  }

  return (
    <div className="space-y-8 text-zinc-900 dark:text-zinc-100">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-zinc-900 dark:text-white">
            Florist Management Console
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Shivam Full Ghar • Bhat Simroli Boutique Inquiries, Custom Requests & Quotations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/admin/products`}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold shadow-2xs transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href={`/${locale}/admin/quotations`}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quotations Inbox</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>New Custom Requests</span>
            <FileText className="w-4 h-4 text-rose-500" />
          </div>
          <span className="font-serif font-bold text-2xl text-zinc-900 dark:text-white block">
            {pendingRequests}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {totalRequests} total requests received
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Quotations Issued</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="font-serif font-bold text-2xl text-amber-600 dark:text-amber-400 block">
            {totalQuotations}
          </span>
          <span className="text-[11px] text-zinc-500">Live price estimates</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Accepted Quotations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 block">
            {acceptedQuotations}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Confirmed for wedding dates
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Active Floral Catalog</span>
            <Package className="w-4 h-4 text-rose-500" />
          </div>
          <span className="font-serif font-bold text-2xl text-zinc-900 dark:text-white block">
            {totalProducts}
          </span>
          <span className="text-[11px] text-zinc-500">Items available in store</span>
        </div>
      </div>

      {/* Recent Requests Pipeline */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
              Recent Custom Requests & Estimates (નવા કસ્ટમ ઓર્ડર અને અંદાજ પત્રકો)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Client wedding requests submitted online for Bhat Simroli boutique fulfillment.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/quotations`}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 font-semibold border-b border-black/10 dark:border-white/10">
              <tr>
                <th className="p-3">Request #</th>
                <th className="p-3">Client Name</th>
                <th className="p-3">Mobile Contact</th>
                <th className="p-3">Event Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Quotation</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {recentRequests.length > 0 ? (
                recentRequests.map((req) => {
                  const latestQuotation = req.quotations?.[0];
                  return (
                    <tr key={req.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 font-mono font-medium text-zinc-900 dark:text-white">
                        {req.requestNumber}
                      </td>
                      <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200">
                        {req.customerName}
                      </td>
                      <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">
                        {req.customerMobile}
                      </td>
                      <td className="p-3 text-zinc-500">
                        {req.eventDate ? formatIST(new Date(req.eventDate)).split(",")[0] : "Flexible"}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {latestQuotation ? (
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                            {latestQuotation.quotationNumber} ({formatPrice(latestQuotation.total / 100)})
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">Pending Builder</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/${locale}/admin/quotations`}
                          className="px-3 py-1 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-800 dark:text-zinc-200 font-medium text-[11px] transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-zinc-500">
                    No custom design requests yet. Inquiries will appear here automatically.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storefront Visitors with Email & Location Telemetry */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              <span>Live Website Visitors & Location Telemetry (મુલાકાતીઓ અને સ્થળ ટ્રેકિંગ)</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Real-time customer visits with identified email accounts and city/state geolocation tracking.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/visitors`}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 font-semibold border-b border-black/10 dark:border-white/10">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Visitor / Email ID</th>
                <th className="p-3">Current Location</th>
                <th className="p-3">Page Visited</th>
                <th className="p-3">Device</th>
                <th className="p-3">Source Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono text-[11px]">
              {recentVisits.length > 0 ? (
                recentVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 text-zinc-500 whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3 font-sans">
                      {v.visitorEmail ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{v.visitorEmail}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[10px] italic">Anonymous Visitor</span>
                      )}
                    </td>
                    <td className="p-3 font-sans">
                      <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{v.city || "Keshod Area"}{v.region ? `, ${v.region}` : ""}</span>
                      </span>
                    </td>
                    <td className="p-3 font-sans text-rose-600 dark:text-rose-400 font-medium">
                      {v.path}
                    </td>
                    <td className="p-3 font-sans capitalize text-zinc-600 dark:text-zinc-400">
                      {v.deviceType}
                    </td>
                    <td className="p-3 font-sans capitalize">
                      <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 text-[10px]">
                        {v.source}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-500">
                    No visitor logs recorded yet today. Storefront traffic will show here in real time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
