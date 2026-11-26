"use client";

import React from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FileText,
  Clock,
  CheckCircle2,
  Package,
  ChevronRight,
  Globe,
  MapPin,
  Mail,
  TrendingUp,
} from "lucide-react";

const CHART_DATA = [
  { day: "Mon", visits: 42, inquiries: 4 },
  { day: "Tue", visits: 58, inquiries: 6 },
  { day: "Wed", visits: 51, inquiries: 5 },
  { day: "Thu", visits: 74, inquiries: 9 },
  { day: "Fri", visits: 89, inquiries: 11 },
  { day: "Sat", visits: 112, inquiries: 14 },
  { day: "Sun", visits: 96, inquiries: 12 },
];

export function GlassyDashboardView({
  locale,
  kpis,
  recentRequests,
  recentVisits,
}: {
  locale: string;
  kpis: {
    totalRequests: number;
    pendingRequests: number;
    totalQuotations: number;
    acceptedQuotations: number;
    totalProducts: number;
  };
  recentRequests: any[];
  recentVisits: any[];
}) {
  return (
    <div className="space-y-8 text-[#282A26]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-brand shadow-xs">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-brand-primary font-bold">
            Spatial Admin Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-deep mt-0.5">
            Florist Management Console
          </h1>
          <p className="text-xs text-[#282A26]/70 mt-1">
            Shivam Full Ghar • Bhat Simroli Boutique Inquiries, Catalog & Visitor Telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/${locale}/admin/products`}
            className="px-4 py-2.5 rounded-xl bg-white border border-brand text-brand-deep hover:bg-brand-surface text-xs font-semibold transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href={`/${locale}/admin/quotations`}
            className="px-4 py-2.5 rounded-xl btn-brand text-xs font-semibold"
          >
            Quotations ({kpis.totalRequests})
          </Link>
        </div>
      </div>

      {/* Glassy KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-brand shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#282A26]/70">
            <span>Custom Requests</span>
            <FileText className="w-4 h-4 text-brand-primary" />
          </div>
          <span className="font-serif font-bold text-3xl text-brand-deep block">
            {kpis.totalRequests}
          </span>
          <span className="text-[11px] text-brand-primary font-semibold">
            {kpis.pendingRequests} awaiting review
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-brand shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#282A26]/70">
            <span>Quotations Issued</span>
            <Clock className="w-4 h-4 text-brand-primary" />
          </div>
          <span className="font-serif font-bold text-3xl text-brand-deep block">
            {kpis.totalQuotations}
          </span>
          <span className="text-[11px] text-[#282A26]/65">Live price estimates</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-brand shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#282A26]/70">
            <span>Accepted Quotations</span>
            <CheckCircle2 className="w-4 h-4 text-brand-primary" />
          </div>
          <span className="font-serif font-bold text-3xl text-brand-deep block">
            {kpis.acceptedQuotations}
          </span>
          <span className="text-[11px] text-brand-primary font-semibold">
            Confirmed wedding dates
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-brand shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#282A26]/70">
            <span>Published Catalog</span>
            <Package className="w-4 h-4 text-brand-primary" />
          </div>
          <span className="font-serif font-bold text-3xl text-brand-deep block">
            {kpis.totalProducts}
          </span>
          <span className="text-[11px] text-[#282A26]/65">Active designs on storefront</span>
        </div>
      </div>

      {/* Interactive Glassy Analytics Chart */}
      <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-brand shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-xl text-brand-deep flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
              <span>Storefront Traffic & Inquiry Trend</span>
            </h2>
            <p className="text-xs text-[#282A26]/65">Weekly customer engagement overview</p>
          </div>
          <Link
            href={`/${locale}/admin/visitors`}
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>Full Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="brandChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#5C5F58" }} />
              <YAxis tick={{ fontSize: 11, fill: "#5C5F58" }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="var(--brand-primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#brandChartFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Requests & Live Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-brand shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand pb-3">
            <h3 className="font-serif font-bold text-lg text-brand-deep">Recent Custom Requests</h3>
            <Link href={`/${locale}/admin/quotations`} className="text-xs font-semibold text-brand-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2.5 text-xs">
            {recentRequests.length > 0 ? (
              recentRequests.map((r: any) => (
                <div key={r.id} className="p-3 rounded-2xl bg-brand-surface border border-brand flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-brand-deep">{r.customerName}</p>
                    <p className="text-[#282A26]/70 font-mono-tech text-[11px]">
                      {r.requestNumber} • {r.customerMobile}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-brand-primary text-[#FAF7EF] text-[10px] font-bold">
                    {r.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#282A26]/60 py-6 text-center">No custom requests yet.</p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-brand shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand pb-3">
            <h3 className="font-serif font-bold text-lg text-brand-deep flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-primary" />
              <span>Live Visitor & Location Telemetry</span>
            </h3>
            <Link href={`/${locale}/admin/visitors`} className="text-xs font-semibold text-brand-primary hover:underline">
              Details
            </Link>
          </div>
          <div className="space-y-2.5 text-xs">
            {recentVisits.length > 0 ? (
              recentVisits.map((v: any) => (
                <div key={v.id} className="p-3 rounded-2xl bg-brand-surface border border-brand flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-deep flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 text-brand-primary shrink-0" />
                      <span>{v.visitorEmail || "Anonymous Visitor"}</span>
                    </p>
                    <p className="text-[11px] text-[#282A26]/70 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-brand-primary shrink-0" />
                      <span>{v.city || "Keshod Area"}{v.region ? `, ${v.region}` : ""} • {v.path}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono-tech text-brand-primary capitalize shrink-0">
                    {v.deviceType}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#282A26]/60 py-6 text-center">No visitor logs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
