"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Calendar,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { HomeBanner, HomeBannerInput } from "@/lib/banners";

const PRESET_IMAGES = [
  { label: "Royal Varmala Hero", url: "/products/hero-wedding.jpg" },
  { label: "Rose Varmala (VM-R01)", url: "/products/VM-R01.jpg" },
  { label: "Car Bonnet Decor (CR-01)", url: "/products/CR-01.jpg" },
  { label: "Bridal Veni (HF-01)", url: "/products/HF-01.jpg" },
  { label: "Mogra Gajra (GJ-01)", url: "/products/GJ-01.jpg" },
  { label: "Floral Jewellery (FJ-01)", url: "/products/FJ-01.jpg" },
];

export default function AdminBannersPage() {
  const locale = useLocale();
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HomeBannerInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<"gu" | "hi" | "en">("gu");
  const [notification, setNotification] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (data.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
      }
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNew = () => {
    setEditingBanner({
      title: { gu: "", hi: "", en: "" },
      subtitle: { gu: "", hi: "", en: "" },
      badge: { gu: "🌸 સ્પેશિયલ", hi: "🌸 स्पेशल", en: "🌸 Special" },
      ctaText: { gu: "કલેક્શન જુઓ", hi: "कलेक्शन देखें", en: "Explore Now" },
      linkUrl: "/shop",
      desktopImage: "/products/hero-wedding.jpg",
      mobileImage: "/products/VM-R01.jpg",
      isActive: true,
      startDate: null,
      endDate: null,
    });
    setActiveLangTab("gu");
    setIsModalOpen(true);
  };

  const handleEdit = (banner: HomeBanner) => {
    setEditingBanner({
      id: banner.id,
      title: { ...banner.title },
      subtitle: { ...banner.subtitle },
      badge: {
        gu: banner.badge?.gu || "🌸 સ્પેશિયલ",
        hi: banner.badge?.hi || "🌸 स्पेशल",
        en: banner.badge?.en || "🌸 Special",
      },
      ctaText: {
        gu: banner.ctaText?.gu || "કલેક્શન જુઓ",
        hi: banner.ctaText?.hi || "कलेक्शन देखें",
        en: banner.ctaText?.en || "Explore Now",
      },
      linkUrl: banner.linkUrl,
      desktopImage: banner.desktopImage,
      mobileImage: banner.mobileImage,
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
      startDate: banner.startDate || null,
      endDate: banner.endDate || null,
    });
    setActiveLangTab("gu");
    setIsModalOpen(true);
  };

  const handleToggleActive = async (banner: HomeBanner) => {
    try {
      const updated = { ...banner, isActive: !banner.isActive };
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) =>
          prev.map((b) => (b.id === banner.id ? { ...b, isActive: !b.isActive } : b))
        );
        showNotification(
          banner.isActive ? "Banner hidden from storefront" : "Banner published to storefront"
        );
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotional banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        showNotification("Banner deleted successfully");
      }
    } catch (err) {
      console.error("Delete banner error:", err);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const reordered = [...banners];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    // Update state immediately for zero-lag UI
    setBanners(reordered);

    try {
      const ids = reordered.map((b) => b.id);
      await fetch("/api/admin/banners/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      showNotification("Banner order updated");
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    if (!editingBanner.title.gu && !editingBanner.title.en) {
      alert("Please provide at least a Gujarati or English title");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBanner),
      });
      const data = await res.json();
      if (data.success && data.banner) {
        showNotification("Banner saved successfully!");
        setIsModalOpen(false);
        setEditingBanner(null);
        await fetchBanners();
      } else {
        alert(data.error || "Failed to save banner");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save banner");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-black text-stone-900 dark:text-white">
              Home Banners Manager (P8-T17)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 mt-1">
            Manage dynamic promotional carousel slides on the home page with separate mobile & desktop photos, 3-language text, and scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Home</span>
          </Link>
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Banners List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading home banners from database...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 space-y-4">
          <p className="text-sm text-stone-500">No home promotional banners found.</p>
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold"
          >
            Create First Banner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((b, idx) => {
            const hasSchedule = b.startDate || b.endDate;
            return (
              <div
                key={b.id}
                className={`rounded-2xl bg-white dark:bg-[#0e0e0e] border ${
                  b.isActive
                    ? "border-black/10 dark:border-white/10 shadow-sm"
                    : "border-black/5 dark:border-white/5 opacity-70"
                } p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 transition-all`}
              >
                {/* Left: Reorder controls + Preview images */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col gap-1 text-stone-400">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, "up")}
                      className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono text-center font-bold text-stone-500">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === banners.length - 1}
                      onClick={() => handleMoveOrder(idx, "down")}
                      className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Desktop Preview */}
                  <div className="space-y-1">
                    <div className="relative w-28 h-16 sm:w-36 sm:h-20 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-black/10 dark:border-white/10">
                      <Image
                        src={b.desktopImage}
                        alt="Desktop"
                        fill
                        className="object-cover"
                        sizes="144px"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-white text-[9px] font-mono">
                        Desktop
                      </span>
                    </div>
                  </div>

                  {/* Mobile Preview */}
                  <div className="space-y-1">
                    <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-black/10 dark:border-white/10">
                      <Image
                        src={b.mobileImage || b.desktopImage}
                        alt="Mobile"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-white text-[8px] font-mono">
                        Mobile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Details */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-500/20">
                      {b.badge?.gu || b.badge?.en || "Special"}
                    </span>
                    <span className="text-xs font-mono text-stone-500 dark:text-zinc-400">
                      Link: {b.linkUrl}
                    </span>
                    {hasSchedule && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300 text-[10px] font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>Scheduled</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                    {b.title.gu || b.title.en}
                  </h3>

                  <div className="text-xs text-stone-500 dark:text-zinc-400 line-clamp-1 space-x-2">
                    {b.title.hi && <span className="font-medium">HI: {b.title.hi}</span>}
                    {b.title.en && <span className="font-medium">EN: {b.title.en}</span>}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-1">
                    {b.subtitle.gu || b.subtitle.en}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      b.isActive
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    {b.isActive ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(b)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#121212] border border-black/15 dark:border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <h2 className="text-xl font-serif font-black text-stone-900 dark:text-white">
                {editingBanner.id ? "Edit Home Banner" : "Add New Home Banner"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-6">
              {/* Language Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Content Languages (GU / HI / EN)
                  </span>
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                    {(["gu", "hi", "en"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLangTab(lang)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeLangTab === lang
                            ? "bg-amber-500 text-stone-950 shadow-xs"
                            : "text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        {lang === "gu" ? "ગુજરાતી" : lang === "hi" ? "हिन्दी" : "English"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Localized Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Banner Title ({activeLangTab.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required={activeLangTab === "gu"}
                    value={editingBanner.title[activeLangTab]}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        title: { ...editingBanner.title, [activeLangTab]: e.target.value },
                      })
                    }
                    placeholder={
                      activeLangTab === "gu"
                        ? "જેમ કે: રોયલ વેડિંગ વરમાળા કલેક્શન ૨૦૨૬"
                        : "e.g. Royal Wedding Varmala Collection 2026"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-sm focus:outline-amber-500"
                  />
                </div>

                {/* Localized Subtitle */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Subtitle / Description ({activeLangTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={editingBanner.subtitle[activeLangTab]}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        subtitle: { ...editingBanner.subtitle, [activeLangTab]: e.target.value },
                      })
                    }
                    placeholder="Short description under title..."
                    className="w-full px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-sm focus:outline-amber-500"
                  />
                </div>

                {/* Localized Badge & CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Pill Badge Tag ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={editingBanner.badge?.[activeLangTab] || ""}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          badge: {
                            gu: editingBanner.badge?.gu || "",
                            hi: editingBanner.badge?.hi || "",
                            en: editingBanner.badge?.en || "",
                            [activeLangTab]: e.target.value,
                          },
                        })
                      }
                      placeholder="🌸 લગ્ન સીઝન સ્પેશિયલ"
                      className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs focus:outline-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Button Text ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={editingBanner.ctaText?.[activeLangTab] || ""}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          ctaText: {
                            gu: editingBanner.ctaText?.gu || "",
                            hi: editingBanner.ctaText?.hi || "",
                            en: editingBanner.ctaText?.en || "",
                            [activeLangTab]: e.target.value,
                          },
                        })
                      }
                      placeholder="વરમાળા જુઓ / View Garlands"
                      className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs focus:outline-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Destination Link */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Target Click Link URL *
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.linkUrl}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, linkUrl: e.target.value })
                  }
                  placeholder="/shop?category=garlands or /packages or WhatsApp link"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-sm focus:outline-amber-500"
                />
              </div>

              {/* Desktop & Mobile Separate Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/10 dark:border-white/10">
                {/* Desktop Image */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Desktop Image URL (16:9 Landscape) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.desktopImage}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, desktopImage: e.target.value })
                    }
                    placeholder="/products/hero-wedding.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs"
                  />
                  {editingBanner.desktopImage && (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 border">
                      <Image
                        src={editingBanner.desktopImage}
                        alt="Desktop Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Mobile Image */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Mobile Image URL (Vertical / Square) *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingBanner({
                          ...editingBanner,
                          mobileImage: editingBanner.desktopImage,
                        })
                      }
                      className="text-[10px] text-amber-600 hover:underline cursor-pointer"
                    >
                      Copy Desktop Image
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingBanner.mobileImage}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, mobileImage: e.target.value })
                    }
                    placeholder="/products/VM-R01.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs"
                  />
                  {editingBanner.mobileImage && (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 border">
                      <Image
                        src={editingBanner.mobileImage}
                        alt="Mobile Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Preset Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-500 uppercase">
                  Quick Preset Catalog Photos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() =>
                        setEditingBanner({
                          ...editingBanner,
                          desktopImage: p.url,
                          mobileImage: p.url,
                        })
                      }
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-zinc-300 border border-black/5 dark:border-white/5 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduling and Active Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-black/10 dark:border-white/10">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Start Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      editingBanner.startDate
                        ? new Date(editingBanner.startDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    End Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      editingBanner.endDate
                        ? new Date(editingBanner.endDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        endDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={editingBanner.isActive}
                      onChange={(e) =>
                        setEditingBanner({ ...editingBanner, isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-xs font-bold text-stone-800 dark:text-white">
                      Active on Home Page
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingBanner.id ? "Update Banner" : "Save & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
