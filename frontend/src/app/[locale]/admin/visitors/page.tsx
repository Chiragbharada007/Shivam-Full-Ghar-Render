// src/app/[locale]/admin/visitors/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Eye,
  TrendingUp,
  Download,
  Filter,
  Smartphone,
  Globe,
  Share2,
  MessageCircle,
  Clock,
  RefreshCw,
  Sparkles,
  MapPin,
  Mail,
} from "lucide-react";

export default function AdminVisitorsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterSource, setFilterSource] = useState("");
  const [filterDevice, setFilterDevice] = useState("");
  const [searchPath, setSearchPath] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterSource) params.set("source", filterSource);
      if (filterDevice) params.set("device", filterDevice);
      if (searchPath) params.set("path", searchPath);

      const res = await fetch(`/api/admin/visitors?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error("Fetch visitors error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterSource, filterDevice]);

  const handleDownloadCsv = () => {
    const params = new URLSearchParams({ export: "csv" });
    if (filterSource) params.set("source", filterSource);
    if (filterDevice) params.set("device", filterDevice);
    window.open(`/api/admin/visitors?${params.toString()}`, "_blank");
  };

  const stats = data?.stats || {
    liveNow: 0,
    today: 0,
    last7Days: 0,
    last30Days: 0,
    eventCounts: { whatsapp_click: 0, custom_request_submit: 0 },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-black text-stone-900 dark:text-white">
              Visitor Analytics & Insights
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Privacy-Friendly • Zero PII
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Real-time storefront visits, source channels, device usage, and WhatsApp inquiry tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-xs flex items-center gap-2 shadow-xs hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Live Now */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Live Now</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.liveNow}
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">Last 5 minutes</span>
        </div>

        {/* Today */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Today</span>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-2xl font-black font-mono text-stone-900 dark:text-white mt-2">
            {stats.today}
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">Visits since 12:00 AM</span>
        </div>

        {/* 7 Days */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>7 Days</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-stone-900 dark:text-white mt-2">
            {stats.last7Days}
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">Weekly volume</span>
        </div>

        {/* 30 Days */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>30 Days</span>
            <Users className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <p className="text-2xl font-black font-mono text-stone-900 dark:text-white mt-2">
            {stats.last30Days}
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">Monthly total</span>
        </div>

        {/* WhatsApp Enquiries */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>WhatsApp Clicks</span>
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.eventCounts?.whatsapp_click || 0}
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">Direct inquiries</span>
        </div>

        {/* Custom Design Requests */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Custom Quotes</span>
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-2">
            {stats.eventCounts?.custom_request_submit || 0}
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">Submissions</span>
        </div>

        {/* Identified Visitors (Email IDs) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Identified Leads</span>
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-2">
            {stats.identifiedVisitors || 0}
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">Tracked with Email</span>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Top Pages */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-rose-500" />
            <span>Top Pages Visited</span>
          </h2>
          <div className="space-y-2">
            {data?.topPages && data.topPages.length > 0 ? (
              data.topPages.map((p: any) => (
                <div key={p.path} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-700 dark:text-stone-300 truncate max-w-[150px]">
                    {p.path}
                  </span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    {p.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">No visits recorded yet</p>
            )}
          </div>
        </div>

        {/* Live Geographic Locations (Cities & Regions) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Visitor Locations</span>
          </h2>
          <div className="space-y-2">
            {data?.locations && data.locations.length > 0 ? (
              data.locations.map((loc: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[150px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{loc.city}{loc.region ? `, ${loc.region}` : ""}</span>
                  </span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    {loc.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">No location telemetry yet</p>
            )}
          </div>
        </div>

        {/* Sources */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-500" />
            <span>Traffic Sources</span>
          </h2>
          <div className="space-y-2">
            {data?.sources && data.sources.length > 0 ? (
              data.sources.map((s: any) => (
                <div key={s.source} className="flex items-center justify-between text-xs">
                  <span className="capitalize text-stone-700 dark:text-stone-300 font-medium">
                    {s.source}
                  </span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    {s.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">No source data yet</p>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>Devices & Platforms</span>
          </h2>
          <div className="space-y-2">
            {data?.devices && data.devices.length > 0 ? (
              data.devices.map((d: any) => (
                <div key={d.device} className="flex items-center justify-between text-xs">
                  <span className="capitalize text-stone-700 dark:text-stone-300 font-medium">
                    {d.device}
                  </span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    {d.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">No device data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Visitor Log Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-rose-500" />
            <span>Recent Visitor Log (Privacy Preserved)</span>
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent text-stone-800 dark:text-stone-200 text-xs"
            >
              <option value="">All Sources</option>
              <option value="direct">Direct</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="google">Google</option>
            </select>

            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent text-stone-800 dark:text-stone-200 text-xs"
            >
              <option value="">All Devices</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
            </select>

            <input
              type="text"
              placeholder="Search path..."
              value={searchPath}
              onChange={(e) => setSearchPath(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent text-stone-800 dark:text-stone-200 text-xs w-32 sm:w-40"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-medium">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Visitor / Email ID</th>
                <th className="py-2.5 px-3">Current Location</th>
                <th className="py-2.5 px-3">Path</th>
                <th className="py-2.5 px-3">Device</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Visitor Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-mono text-[11px]">
              {data?.logs && data.logs.length > 0 ? (
                data.logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-2 px-3 text-stone-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {log.visitorEmail ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-sans">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[160px]">{log.visitorEmail}</span>
                        </span>
                      ) : (
                        <span className="text-stone-400 font-sans text-[10px] italic">
                          Anonymous Visitor
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1 font-sans">
                        <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[160px]">
                          {log.city || "Keshod Area"}{log.region ? `, ${log.region}` : ""}
                        </span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-rose-600 dark:text-rose-400 font-semibold truncate max-w-[160px]">
                      {log.path}
                    </td>
                    <td className="py-2 px-3 capitalize text-stone-600 dark:text-stone-300">
                      {log.deviceType} ({log.browser})
                    </td>
                    <td className="py-2 px-3 capitalize">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          log.source === "whatsapp"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : log.source === "instagram"
                            ? "bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300"
                            : log.source === "google"
                            ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        {log.source}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {log.isReturning ? (
                        <span className="text-purple-600 dark:text-purple-400">Returning</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">New Visitor</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    {loading ? "Loading visitor telemetry..." : "No visits recorded yet"}
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
