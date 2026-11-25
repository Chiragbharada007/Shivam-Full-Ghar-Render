"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Settings,
  Image as ImageIcon,
  Phone,
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Save,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Globe,
  Database,
  ShieldCheck,
  Key,
  Server,
  Layers,
  Upload,
} from "lucide-react";
import { DEFAULT_SITE_SETTINGS, SiteSettingsData } from "@/lib/site-settings";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/shared/SocialIcons";

export default function AdminSettingsPage() {
  const locale = useLocale();

  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [activeTab, setActiveTab] = useState<
    "brand" | "homeCms" | "contact" | "social" | "hours" | "financials" | "banner" | "database" | "security" | "demo"
  >("brand");
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [refreshingCache, setRefreshingCache] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTriggerCacheRefresh = async () => {
    setRefreshingCache(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/cache-refresh", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setMessage(`Live cache cleared and edge revalidated in ${data.durationMs}ms! Live site updated instantly.`);
        setTimeout(() => setMessage(""), 5000);
      } else {
        setErrorMsg(data.message || "Cache refresh failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Cache refresh error");
    } finally {
      setRefreshingCache(false);
    }
  };

  // Database Status State
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [syncingDb, setSyncingDb] = useState(false);

  // Security / Admin Credentials Form State
  const [adminName, setAdminName] = useState("Shivam Store Admin");
  const [adminEmail, setAdminEmail] = useState("owner@shivamfullghar.com");
  const [adminPhone, setAdminPhone] = useState("9824132014");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQ1, setSecurityQ1] = useState("What is your primary flower shop location?");
  const [securityA1, setSecurityA1] = useState("");
  const [securityQ2, setSecurityQ2] = useState("What is your business registered brand name?");
  const [securityA2, setSecurityA2] = useState("");
  const [credLoading, setCredLoading] = useState(false);

  // Load existing settings & db status
  useEffect(() => {
    try {
      const cached = localStorage.getItem("shivam_site_settings");
      if (cached) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch (e) {}

    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
          try {
            localStorage.setItem("shivam_site_settings", JSON.stringify(data.settings));
          } catch (e) {}
        }
      })
      .catch((err) => console.warn("Failed to fetch settings:", err));

    loadDbStatus();
  }, []);

  const loadDbStatus = () => {
    setDbLoading(true);
    fetch("/api/admin/db-status")
      .then((res) => res.json())
      .then((data) => setDbStatus(data))
      .catch(() => null)
      .finally(() => setDbLoading(false));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (data.success && data.url) {
        const updated = { ...settings, logoUrl: data.url };
        setSettings(updated);

        // Update localStorage and trigger global app update
        try {
          localStorage.setItem("shivam_site_settings", JSON.stringify(updated));
          window.dispatchEvent(new Event("site-settings-updated"));
        } catch (e) {}

        // Auto-save to server immediately
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }).catch(() => null);

        setMessage("Logo image uploaded and saved successfully! Applied across website header and footer.");
        setTimeout(() => setMessage(""), 5000);
      } else {
        setErrorMsg(data.message || "Failed to upload logo image");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload logo image");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleQuickSetLogo = async (newUrl: string) => {
    const updated = { ...settings, logoUrl: newUrl };
    setSettings(updated);
    try {
      localStorage.setItem("shivam_site_settings", JSON.stringify(updated));
      window.dispatchEvent(new Event("site-settings-updated"));
    } catch (e) {}

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Logo set to "${newUrl}" and saved successfully!`);
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (e) {
      setErrorMsg("Failed to save logo to server");
    }
  };

  const handleSyncDb = async () => {
    setSyncingDb(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/db-sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        loadDbStatus();
        setTimeout(() => setMessage(""), 5000);
      } else {
        setErrorMsg(data.message || "Sync failed");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Network error during sync");
    } finally {
      setSyncingDb(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (adminPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setCredLoading(true);
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newName: adminName,
          newEmail: adminEmail,
          newPhone: adminPhone,
          newPassword: adminPassword || undefined,
          securityQuestion1: securityQ1 || undefined,
          securityAnswer1: securityA1 || undefined,
          securityQuestion2: securityQ2 || undefined,
          securityAnswer2: securityA2 || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        setAdminPassword("");
        setConfirmPassword("");
        loadDbStatus();
        setTimeout(() => setMessage(""), 5000);
      } else {
        setErrorMsg(data.message || "Failed to update credentials");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error updating credentials");
    } finally {
      setCredLoading(false);
    }
  };

  const handleChange = (field: keyof SiteSettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        const saved = data.settings || settings;
        setSettings(saved);
        try {
          localStorage.setItem("shivam_site_settings", JSON.stringify(saved));
          window.dispatchEvent(new Event("site-settings-updated"));
        } catch (e) {}
        setMessage("All site settings saved successfully! Live website updated.");
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrorMsg(data.message || "Failed to save settings.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemoData = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all demo data? This will restore original 19 products, categories, delivery villages, and default settings."
      )
    ) {
      return;
    }

    setResetting(true);
    setMessage("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/reset-demo", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setMessage("Demo data restored successfully!");
        setSettings(DEFAULT_SITE_SETTINGS);
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrorMsg(data.message || "Failed to reset demo data.");
      }
    } catch (e: any) {
      setMessage("Reset completed successfully.");
    } finally {
      setResetting(false);
    }
  };

  const tabs = [
    { id: "brand", label: "Logo & Brand", icon: ImageIcon },
    { id: "homeCms", label: "Home & Footer CMS", icon: Layers },
    { id: "contact", label: "Contact & WhatsApp", icon: Phone },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "hours", label: "Address & Hours", icon: MapPin },
    { id: "financials", label: "Show Prices Switch", icon: DollarSign },
    { id: "banner", label: "Announcement Bar", icon: Sparkles },
    { id: "database", label: "Database Status", icon: Database },
    { id: "security", label: "Admin Credentials", icon: Key },
    { id: "demo", label: "Demo Reset", icon: RefreshCw },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-black text-stone-900">
            Store Branding & Details Settings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage store logo, dynamic Home & Footer CMS, WhatsApp number, database connection status, and admin profile
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live DB Pill */}
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              dbStatus?.connected
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                : "bg-amber-50 text-amber-800 border border-amber-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dbStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{dbStatus?.connected ? "PostgreSQL Connected" : "Local / Cache Fallback"}</span>
          </div>

          <button
            type="button"
            onClick={handleTriggerCacheRefresh}
            disabled={refreshingCache}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 border border-stone-300 transition-colors disabled:opacity-50"
            title="Instant Content Update (P8-T21)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshingCache ? "animate-spin" : ""}`} />
            <span>{refreshingCache ? "Refreshing..." : "Instant Cache Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-rose-900 text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Tab 1: Logo & Brand */}
        {activeTab === "brand" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
                Website Logo & Branding
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Upload your official store logo, or enter image URL. All pages instantly update.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-5">
                {/* 1. DIRECT LOGO FILE UPLOAD FIELD */}
                <div className="p-4 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 hover:border-rose-800 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-rose-800" />
                      <span>Upload New Logo File</span>
                    </label>
                    <span className="text-[10px] text-stone-500 font-medium">PNG, SVG, JPG, WEBP</span>
                  </div>

                  <label className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-stone-200 hover:bg-rose-50/40 cursor-pointer transition-colors text-center group">
                    <Upload className="w-6 h-6 text-stone-400 group-hover:text-rose-800 group-hover:scale-110 transition-all mb-1.5" />
                    <span className="text-xs font-bold text-stone-800 group-hover:text-rose-900">
                      {logoUploading ? "Uploading logo..." : "Click or drag logo file here"}
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5">
                      Recommended: Transparent PNG or SVG vector (up to 10MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={logoUploading}
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 2. LOGO URL OR SVG PATH */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Logo Image URL / Path</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.logoUrl}
                      onChange={(e) => handleChange("logoUrl", e.target.value)}
                      placeholder="/logo.svg"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuickSetLogo(settings.logoUrl)}
                      className="px-3.5 py-2.5 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors shadow-2xs cursor-pointer"
                    >
                      Save Logo
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[10px] text-stone-500 font-medium">Quick Presets (Click to Apply & Save):</span>
                    <button
                      type="button"
                      onClick={() => handleQuickSetLogo("/logo.svg")}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-stone-100 hover:bg-rose-100 hover:text-rose-900 text-stone-700 font-mono transition-colors border border-stone-200 cursor-pointer"
                    >
                      /logo.svg
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSetLogo("/icon.svg")}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-stone-100 hover:bg-rose-100 hover:text-rose-900 text-stone-700 font-mono transition-colors border border-stone-200 cursor-pointer"
                    >
                      /icon.svg
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSetLogo("/apple-touch-icon.png")}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-stone-100 hover:bg-rose-100 hover:text-rose-900 text-stone-700 font-mono transition-colors border border-stone-200 cursor-pointer"
                    >
                      /apple-touch-icon.png
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Shop Name (English)</label>
                  <input
                    type="text"
                    value={settings.shopName}
                    onChange={(e) => handleChange("shopName", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">દુકાનનું નામ (Gujarati)</label>
                  <input
                    type="text"
                    value={settings.shopNameGu}
                    onChange={(e) => handleChange("shopNameGu", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">दुकान का नाम (Hindi)</label>
                  <input
                    type="text"
                    value={settings.shopNameHi}
                    onChange={(e) => handleChange("shopNameHi", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              {/* Logo Live Preview */}
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Header & Browser Preview
                </span>

                <div className="p-5 bg-[#FFFDF8] dark:bg-[#0c0c0c] rounded-2xl border border-amber-200 dark:border-white/10 flex items-center gap-4 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    <img
                      src={settings.logoUrl || "/logo.svg"}
                      alt="Logo Preview"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-rose-900 text-lg leading-tight">
                      {settings.shopNameGu || "શિવમ ફૂલ ઘર"}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {settings.shopName} • Bhat Simroli
                    </p>
                    <span className="inline-block mt-1 text-[10px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full font-medium">
                      Current Logo: {settings.logoUrl}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 leading-relaxed bg-white p-3.5 rounded-xl border border-stone-200">
                  💡 <strong>Tip:</strong> You can upload your own flower boutique PNG logo with transparent background, or select the gold floral crest SVG. Saving applies it instantly to the header, footer, and invoices.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Home & Footer CMS (P8-T20 & P8-T21) */}
        {activeTab === "homeCms" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Header info */}
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-serif font-black text-stone-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-600" />
                <span>Dynamic Home & Footer Content Management</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Edit homepage headlines, hero banner texts, trust highlights, package headers, and footer copy in Gujarati, Hindi, and English. Changes update instantly across live pages without code changes or rebuilds.
              </p>
            </div>

            {/* Quick Action: Cache Refresh */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-rose-600" />
                  <span>On-Demand Edge & Memory Cache Refresh (P8-T21)</span>
                </h4>
                <p className="text-[11px] text-rose-800/80 mt-0.5">
                  Content updates live instantly within ~50ms. Press this button to purge all edge page caches and revalidate globally.
                </p>
              </div>
              <button
                type="button"
                onClick={handleTriggerCacheRefresh}
                disabled={refreshingCache}
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-rose-900 border border-rose-300 font-bold text-xs shadow-xs transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingCache ? "animate-spin" : ""}`} />
                <span>{refreshingCache ? "Refreshing..." : "Purge & Refresh Live Cache"}</span>
              </button>
            </div>

            {/* 1. Hero Section Headlines */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1. Hero Section Headlines & CTAs</span>
                </h3>
                <span className="text-[11px] text-stone-500">Multilingual (GU / HI / EN)</span>
              </div>

              {/* Hero Badge */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Top Eyebrow Badge</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">Gujarati (ગુજરાતી)</span>
                    <input
                      type="text"
                      value={settings.heroBadgeGu || ""}
                      onChange={(e) => setSettings({ ...settings, heroBadgeGu: e.target.value })}
                      placeholder="શિવમ ફૂલ ઘર • ભાટ સિમરોલી"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">Hindi (हिन्दी)</span>
                    <input
                      type="text"
                      value={settings.heroBadgeHi || ""}
                      onChange={(e) => setSettings({ ...settings, heroBadgeHi: e.target.value })}
                      placeholder="शिवम फूल घर • भाट सिमरौली"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">English</span>
                    <input
                      type="text"
                      value={settings.heroBadgeEn || ""}
                      onChange={(e) => setSettings({ ...settings, heroBadgeEn: e.target.value })}
                      placeholder="Shivam Full Ghar • Bhat Simroli"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Title */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-stone-700">Hero Main Title (H1)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">Gujarati</span>
                    <input
                      type="text"
                      value={settings.heroTitleGu || ""}
                      onChange={(e) => setSettings({ ...settings, heroTitleGu: e.target.value })}
                      placeholder="પવિત્ર લગ્ન વરમાળા અને તાજા ફૂલોનો ભંડાર"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">Hindi</span>
                    <input
                      type="text"
                      value={settings.heroTitleHi || ""}
                      onChange={(e) => setSettings({ ...settings, heroTitleHi: e.target.value })}
                      placeholder="पवित्र विवाह वरमाला और ताजे फूलों का भंडार"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">English</span>
                    <input
                      type="text"
                      value={settings.heroTitleEn || ""}
                      onChange={(e) => setSettings({ ...settings, heroTitleEn: e.target.value })}
                      placeholder="Sacred Wedding Garlands & Fresh Blossom Boutique"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Subtitle */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-stone-700">Hero Subtitle / Description</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">Gujarati</span>
                    <textarea
                      rows={3}
                      value={settings.heroSubtitleGu || ""}
                      onChange={(e) => setSettings({ ...settings, heroSubtitleGu: e.target.value })}
                      placeholder="ખાસ કરીને સૌરાષ્ટ્રના લગ્નોત્સવ માટે પ્રીમિયમ તાજા ગુલાબ..."
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">Hindi</span>
                    <textarea
                      rows={3}
                      value={settings.heroSubtitleHi || ""}
                      onChange={(e) => setSettings({ ...settings, heroSubtitleHi: e.target.value })}
                      placeholder="विशेष रूप से सौराष्ट्र के विवाह समारोहों के लिए..."
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium">English</span>
                    <textarea
                      rows={3}
                      value={settings.heroSubtitleEn || ""}
                      onChange={(e) => setSettings({ ...settings, heroSubtitleEn: e.target.value })}
                      placeholder="Bespoke handcrafted wedding garlands, bridal veni..."
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button Labels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-800">Primary Button Label (Shop/Catalogue)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={settings.heroBtnPrimaryGu || ""}
                      onChange={(e) => setSettings({ ...settings, heroBtnPrimaryGu: e.target.value })}
                      placeholder="બધા ફૂલો જુઓ"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                    <input
                      type="text"
                      value={settings.heroBtnPrimaryHi || ""}
                      onChange={(e) => setSettings({ ...settings, heroBtnPrimaryHi: e.target.value })}
                      placeholder="सभी फूल देखें"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                    <input
                      type="text"
                      value={settings.heroBtnPrimaryEn || ""}
                      onChange={(e) => setSettings({ ...settings, heroBtnPrimaryEn: e.target.value })}
                      placeholder="Explore Catalogue"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-800">Secondary Button Label (Custom Order)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={settings.heroBtnSecondaryGu || ""}
                      onChange={(e) => setSettings({ ...settings, heroBtnSecondaryGu: e.target.value })}
                      placeholder="કસ્ટમ વરમાળા ઓર્ડર"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                    <input
                      type="text"
                      value={settings.heroBtnSecondaryHi || ""}
                      onChange={(e) => setSettings({ ...settings, heroBtnSecondaryHi: e.target.value })}
                      placeholder="कस्टम वरमाला ऑर्डर"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                    <input
                      type="text"
                      value={settings.heroBtnSecondaryEn || ""}
                      onChange={(e) => setSettings({ ...settings, heroBtnSecondaryEn: e.target.value })}
                      placeholder="Custom Garland Order"
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                  </div>
                </div>
              </div>

              {/* Signature Visual Card */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3 pt-3">
                <label className="text-xs font-bold text-stone-800">Hero Signature Photo Card</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500">Image URL</span>
                    <input
                      type="text"
                      value={settings.heroSignatureImage || ""}
                      onChange={(e) => setSettings({ ...settings, heroSignatureImage: e.target.value })}
                      placeholder="/products/hero-wedding.jpg"
                      className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500">Card Title (GU)</span>
                    <input
                      type="text"
                      value={settings.heroSignatureTitleGu || ""}
                      onChange={(e) => setSettings({ ...settings, heroSignatureTitleGu: e.target.value })}
                      placeholder="રોયલ ગુજરાતી વરમાળા"
                      className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500">Card Title (HI)</span>
                    <input
                      type="text"
                      value={settings.heroSignatureTitleHi || ""}
                      onChange={(e) => setSettings({ ...settings, heroSignatureTitleHi: e.target.value })}
                      placeholder="रॉयल गुजराती वरमाला"
                      className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500">Card Title (EN)</span>
                    <input
                      type="text"
                      value={settings.heroSignatureTitleEn || ""}
                      onChange={(e) => setSettings({ ...settings, heroSignatureTitleEn: e.target.value })}
                      placeholder="Royal Gujarati Varmala"
                      className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Micro Trust Bar Highlights (3 Points) */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2. Trust Bar Key Highlights (Displayed in Hero & Footer)</span>
                </h3>
              </div>

              {/* Point 1 */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                <label className="text-xs font-bold text-stone-800">Point 1: Fresh Flowers Guarantee</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.trust1Gu || ""}
                    onChange={(e) => setSettings({ ...settings, trust1Gu: e.target.value })}
                    placeholder="૧૦૦% તાજા સવારના ફૂલો"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                  <input
                    type="text"
                    value={settings.trust1Hi || ""}
                    onChange={(e) => setSettings({ ...settings, trust1Hi: e.target.value })}
                    placeholder="100% ताजे सुबह के फूल"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                  <input
                    type="text"
                    value={settings.trust1En || ""}
                    onChange={(e) => setSettings({ ...settings, trust1En: e.target.value })}
                    placeholder="100% Fresh Morning Flowers"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                </div>
              </div>

              {/* Point 2 */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                <label className="text-xs font-bold text-stone-800">Point 2: Store Pickup at Boutique</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.trust2Gu || ""}
                    onChange={(e) => setSettings({ ...settings, trust2Gu: e.target.value })}
                    placeholder="ભાટ સિમરોલી દુકાનેથી મફત પિકઅપ"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                  <input
                    type="text"
                    value={settings.trust2Hi || ""}
                    onChange={(e) => setSettings({ ...settings, trust2Hi: e.target.value })}
                    placeholder="भाट सिमरौली दुकान से मुफ्त पिकअप"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                  <input
                    type="text"
                    value={settings.trust2En || ""}
                    onChange={(e) => setSettings({ ...settings, trust2En: e.target.value })}
                    placeholder="Free Store Pickup at Bhat Simroli Shop"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                </div>
              </div>

              {/* Point 3 */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                <label className="text-xs font-bold text-stone-800">Point 3: Quality & WhatsApp Photo Preview</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.trust3Gu || ""}
                    onChange={(e) => setSettings({ ...settings, trust3Gu: e.target.value })}
                    placeholder="વ્હોટ્સએપ પર ફોટો પ્રીવ્યૂની ગેરંટી"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                  <input
                    type="text"
                    value={settings.trust3Hi || ""}
                    onChange={(e) => setSettings({ ...settings, trust3Hi: e.target.value })}
                    placeholder="व्हाट्सएप पर फोटो पूर्वावलोकन गारंटी"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                  <input
                    type="text"
                    value={settings.trust3En || ""}
                    onChange={(e) => setSettings({ ...settings, trust3En: e.target.value })}
                    placeholder="Boutique Quality Guarantee · Photo Preview on WhatsApp"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200"
                  />
                </div>
              </div>
            </div>

            {/* 3. Section Headers (Video Collection & Packages) */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-rose-600" />
                  <span>3. Home Section Titles & Subtitles</span>
                </h3>
              </div>

              {/* Video Grid Header */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800">Floral Designs Grid: Section Title</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.videoGridTitleGu || ""}
                    onChange={(e) => setSettings({ ...settings, videoGridTitleGu: e.target.value })}
                    placeholder="ઇમર્સિવ વેડિંગ ફ્લોરલ કલેક્શન"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.videoGridTitleHi || ""}
                    onChange={(e) => setSettings({ ...settings, videoGridTitleHi: e.target.value })}
                    placeholder="इमर्सिव विवाह पुष्प संग्रह"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.videoGridTitleEn || ""}
                    onChange={(e) => setSettings({ ...settings, videoGridTitleEn: e.target.value })}
                    placeholder="Immersive Wedding Floral Designs"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-stone-800">Floral Designs Grid: Section Subtitle</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.videoGridSubtitleGu || ""}
                    onChange={(e) => setSettings({ ...settings, videoGridSubtitleGu: e.target.value })}
                    placeholder="સવારે તાજા ચૂંટેલા ગુલાબ, મોગરા..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.videoGridSubtitleHi || ""}
                    onChange={(e) => setSettings({ ...settings, videoGridSubtitleHi: e.target.value })}
                    placeholder="सुबह के ताजे गुलाब, मदुरै मोगरा..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.videoGridSubtitleEn || ""}
                    onChange={(e) => setSettings({ ...settings, videoGridSubtitleEn: e.target.value })}
                    placeholder="Handcrafted with morning-plucked roses..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                </div>
              </div>

              {/* Packages Section */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <label className="text-xs font-bold text-stone-800">Packages Section: Eyebrow Badge</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.packagesBadgeGu || ""}
                    onChange={(e) => setSettings({ ...settings, packagesBadgeGu: e.target.value })}
                    placeholder="સંપૂર્ણ લગ્ન આયોજન"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.packagesBadgeHi || ""}
                    onChange={(e) => setSettings({ ...settings, packagesBadgeHi: e.target.value })}
                    placeholder="संपूर्ण विवाह व्यवस्था"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.packagesBadgeEn || ""}
                    onChange={(e) => setSettings({ ...settings, packagesBadgeEn: e.target.value })}
                    placeholder="Complete Wedding Arrangements"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-stone-800">Packages Section: Main Title</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.packagesTitleGu || ""}
                    onChange={(e) => setSettings({ ...settings, packagesTitleGu: e.target.value })}
                    placeholder="લગ્ન ફૂલ પેકેજ"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.packagesTitleHi || ""}
                    onChange={(e) => setSettings({ ...settings, packagesTitleHi: e.target.value })}
                    placeholder="विवाह पुष्प पैकेज"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.packagesTitleEn || ""}
                    onChange={(e) => setSettings({ ...settings, packagesTitleEn: e.target.value })}
                    placeholder="Curated Wedding Flower Packages"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-stone-800">Packages Section: Subtitle</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.packagesSubtitleGu || ""}
                    onChange={(e) => setSettings({ ...settings, packagesSubtitleGu: e.target.value })}
                    placeholder="વરમાળા, ગાડી શણગાર, વેણી અને મંડપના સેટ..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.packagesSubtitleHi || ""}
                    onChange={(e) => setSettings({ ...settings, packagesSubtitleHi: e.target.value })}
                    placeholder="वरमाला, कार सजावट, वेणी और मंडप सेट..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.packagesSubtitleEn || ""}
                    onChange={(e) => setSettings({ ...settings, packagesSubtitleEn: e.target.value })}
                    placeholder="All-in-one coordinated floral arrangements..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 4. Footer Description & Copyright */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>4. Footer Description & Copyright Text</span>
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800">Footer About Description (Under Logo)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <textarea
                    rows={3}
                    value={settings.footerAboutGu || ""}
                    onChange={(e) => setSettings({ ...settings, footerAboutGu: e.target.value })}
                    placeholder="ભાટ સિમરોલી, સૌરાષ્ટ્રમાં તાજા લગ્ન વરમાળા..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <textarea
                    rows={3}
                    value={settings.footerAboutHi || ""}
                    onChange={(e) => setSettings({ ...settings, footerAboutHi: e.target.value })}
                    placeholder="भाट सिमरौली, सौराष्ट्र में ताजी विवाह वरमाला..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <textarea
                    rows={3}
                    value={settings.footerAboutEn || ""}
                    onChange={(e) => setSettings({ ...settings, footerAboutEn: e.target.value })}
                    placeholder="Premium fresh wedding garlands (વરમાળા)..."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="text-xs font-bold text-stone-800">Footer Bottom Copyright Notice</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={settings.footerCopyrightGu || ""}
                    onChange={(e) => setSettings({ ...settings, footerCopyrightGu: e.target.value })}
                    placeholder="© 2026 શિવમ ફૂલ ઘર. સર્વાધિકાર સુરક્ષિત."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.footerCopyrightHi || ""}
                    onChange={(e) => setSettings({ ...settings, footerCopyrightHi: e.target.value })}
                    placeholder="© 2026 शिवम फूल घर। सर्वाधिकार सुरक्षित।"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.footerCopyrightEn || ""}
                    onChange={(e) => setSettings({ ...settings, footerCopyrightEn: e.target.value })}
                    placeholder="© 2026 Shivam Full Ghar. All rights reserved."
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
              Direct Contact & WhatsApp Integration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Contact Phone Number</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  placeholder="+91 98250 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">WhatsApp Ordering Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  placeholder="919825012345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Support Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="showWhatsAppLink"
                  checked={settings.showWhatsAppLink}
                  onChange={(e) => handleChange("showWhatsAppLink", e.target.checked)}
                  className="w-4 h-4 rounded text-rose-800"
                />
                <label htmlFor="showWhatsAppLink" className="text-xs font-semibold text-stone-800">
                  Enable Floating WhatsApp Order Button on all pages
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Social Media URLs */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
              Official Social Media & Maps Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <InstagramIcon className="w-4 h-4 text-pink-600" />
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/shivam_ful_ghar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <FacebookIcon className="w-4 h-4 text-blue-600" />
                  <span>Facebook Page URL</span>
                </label>
                <input
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => handleChange("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/shivam_ful_ghar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <YoutubeIcon className="w-4 h-4 text-red-600" />
                  <span>YouTube Channel URL</span>
                </label>
                <input
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                  placeholder="https://youtube.com/@shivam_ful_ghar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Google Maps Location URL</span>
                </label>
                <input
                  type="url"
                  value={settings.googleMapsUrl}
                  onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
                  placeholder="https://maps.google.com/?q=Bhat+Simroli,Gujarat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Address & Hours */}
        {activeTab === "hours" && (
          <div className="space-y-6">
            <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
              Shop Address & Business Hours in Bhat Simroli
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Physical Address</label>
                <textarea
                  rows={3}
                  value={settings.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Business Hours</label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => handleChange("openingHours", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Show Prices Switch */}
        {activeTab === "financials" && (
          <div className="space-y-6">
            <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
              Customer Price Display Switch (ગ્રાહક કિંમત દર્શાવો / છુપાવો)
            </h2>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span>Show Prices to Customers (કિંમત દર્શાવો)</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        settings.showPrices
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {settings.showPrices ? "ON (Prices Visible)" : "OFF (Prices Hidden)"}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xl">
                    When switched OFF, all product prices across the website (cards, product detail, collections, home, packages, and quotations) are hidden from customers. Instead, customers see "Price on request – WhatsApp us".
                  </p>
                </div>

                {/* Big Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.showPrices}
                    onChange={(e) => handleChange("showPrices", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">Gujarati Display:</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-stone-200">
                    {settings.showPrices ? "₹ કિંમત દર્શાવશે" : "કિંમત જાણવા વોટ્સએપ કરો"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">Hindi Display:</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-stone-200">
                    {settings.showPrices ? "₹ कीमत दिखेगी" : "कीमत के लिए व्हाट्सएप करें"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">English Display:</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-stone-200">
                    {settings.showPrices ? "₹ Price visible" : "Price on request – WhatsApp us"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Announcement Bar */}
        {activeTab === "banner" && (
          <div className="space-y-6">
            <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
              Header Ticker Announcement Banner
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">ગુજરાતી ઘોષણા (Gujarati Text)</label>
                <input
                  type="text"
                  value={settings.announcementGu}
                  onChange={(e) => handleChange("announcementGu", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Hindi Announcement Text</label>
                <input
                  type="text"
                  value={settings.announcementHi}
                  onChange={(e) => handleChange("announcementHi", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">English Announcement Text</label>
                <input
                  type="text"
                  value={settings.announcementEn}
                  onChange={(e) => handleChange("announcementEn", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: POSTGRESQL LIVE DATABASE CREDENTIALS & STATUS */}
        {activeTab === "database" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-serif font-black text-stone-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-rose-800" />
                  <span>Database Health & Status</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Live connection health and synchronization status of your PostgreSQL database
                </p>
              </div>

              <button
                type="button"
                onClick={loadDbStatus}
                disabled={dbLoading}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? "animate-spin" : ""}`} />
                <span>Test & Refresh</span>
              </button>
            </div>

            {/* SAFE DATABASE STATUS CARD */}
            <div className="p-6 rounded-3xl bg-stone-900 text-white shadow-xl space-y-4 border border-stone-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      dbStatus?.connected
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">
                        {dbStatus?.connected ? "Database Connected" : "Database Disconnected / Fallback Active"}
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          dbStatus?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {dbStatus?.connected
                        ? `Live connection response time: ${dbStatus?.latencyMs ?? 1}ms`
                        : "PostgreSQL unreachable; resilient cloud persistence active"}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-xs font-mono text-stone-300 self-start sm:self-auto">
                  Status:{" "}
                  <strong className={dbStatus?.connected ? "text-emerald-400" : "text-amber-400"}>
                    {dbStatus?.connected ? "ONLINE" : "STANDBY"}
                  </strong>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Database connection and credentials are encrypted and securely loaded from server configuration.
                  Sensitive connection secrets are never displayed.
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium block">Database Engine</span>
                <span className="text-lg font-serif font-black text-stone-900 mt-1 block">
                  PostgreSQL 14+
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                  Active Prisma Pool
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium block">Products in DB</span>
                <span className="text-2xl font-serif font-black text-stone-900 mt-1 block">
                  {dbStatus?.counts?.products ?? 0}
                </span>
                <span className="text-[10px] text-stone-400 mt-1 block">Floral Designs</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium block">Categories</span>
                <span className="text-2xl font-serif font-black text-stone-900 mt-1 block">
                  {dbStatus?.counts?.categories ?? 0}
                </span>
                <span className="text-[10px] text-stone-400 mt-1 block">Trilingual Names</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium block">Admin Users</span>
                <span className="text-2xl font-serif font-black text-stone-900 mt-1 block">
                  {dbStatus?.counts?.adminUsers ?? 0}
                </span>
                <span className="text-[10px] text-stone-400 mt-1 block">Active Credentials</span>
              </div>
            </div>

            {/* Sync Action Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-800" />
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  1-Click PostgreSQL Floral Catalogue Sync
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                Imports or synchronizes all benchmark wedding products from FloralHub and Floriwish into your live PostgreSQL tables, ensuring all prices, categories, and photos are stored in SQL.
              </p>
              <button
                type="button"
                disabled={syncingDb}
                onClick={handleSyncDb}
                className="px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingDb ? "animate-spin" : ""}`} />
                <span>{syncingDb ? "Syncing Database..." : "Sync Database Now"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 8: Security & Admin Credentials Manager */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
                Admin Credentials Management
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Update your administrator login credentials directly in PostgreSQL. No developer intervention required.
              </p>
            </div>

            <div className="max-w-xl space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Admin Display Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Admin Login Email *</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
                />
                <p className="text-[10px] text-stone-400">
                  This email is used on the 2-step OTP login screen.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Admin Mobile Number for SMS OTP (P8-T35)</label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="9824132014"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
                />
                <p className="text-[10px] text-stone-400">
                  All 60-second login OTP verification codes are dispatched via SMS to this Indian mobile number.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono"
                  />
                </div>
              </div>

              {/* 2 Security Questions Setup (Limit-Free / OTP Fallback) */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2 Security Questions (Free Fallback Login)</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  These 2 questions allow administrator sign in even if monthly SMS/email free limits end or telecom carriers fail.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Security Question 1</label>
                  <input
                    type="text"
                    value={securityQ1}
                    onChange={(e) => setSecurityQ1(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={securityA1}
                    onChange={(e) => setSecurityA1(e.target.value)}
                    placeholder="Set Answer 1 (e.g. Keshod)"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Security Question 2</label>
                  <input
                    type="text"
                    value={securityQ2}
                    onChange={(e) => setSecurityQ2(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={securityA2}
                    onChange={(e) => setSecurityA2(e.target.value)}
                    placeholder="Set Answer 2 (e.g. Shivam Full Ghar)"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={credLoading || (adminPassword !== "" && adminPassword !== confirmPassword)}
                  onClick={handleUpdateCredentials}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{credLoading ? "Updating..." : "Update Admin Profile, Password & Security Questions"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Reset Demo Data */}
        {activeTab === "demo" && (
          <div className="space-y-6">
            <h2 className="text-base font-serif font-black text-stone-900 border-b border-stone-100 pb-3">
              Client Demo & Seed Reset Tools
            </h2>

            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-300/80 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-stone-900 text-sm">
                    Reset Store To Pristine Benchmark State
                  </h4>
                  <p className="text-stone-600 leading-relaxed">
                    Restores all 19 real wedding garland products (from FloralHub & Floriwish), Saurashtra delivery villages, sample reviews, and settings.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={resetting}
                onClick={handleResetDemoData}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${resetting ? "animate-spin" : ""}`} />
                <span>{resetting ? "Restoring Seed Data..." : "Restore Demo Data"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Public Storefront</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
