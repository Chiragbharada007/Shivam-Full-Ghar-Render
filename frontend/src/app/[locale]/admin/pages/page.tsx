"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Check,
  X,
  Loader2,
  Menu as MenuIcon,
  Globe,
} from "lucide-react";
import { CustomPage, CustomPageInput } from "@/lib/custom-pages";

const PRESET_PAGE_IMAGES = [
  { label: "Varmala Hero", url: "/products/VM-R01.jpg" },
  { label: "Car Decor", url: "/products/CR-01.jpg" },
  { label: "Bridal Veni", url: "/products/HF-01.jpg" },
  { label: "Mogra Gajra", url: "/products/GJ-01.jpg" },
  { label: "Grand Wedding", url: "/products/hero-wedding.jpg" },
];

export default function AdminCustomPagesPage() {
  const locale = useLocale();
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPageInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<"gu" | "hi" | "en">("gu");
  const [notification, setNotification] = useState<string | null>(null);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.success && Array.isArray(data.pages)) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error("Failed to load custom pages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNew = () => {
    setEditingPage({
      slug: "",
      title: { gu: "", hi: "", en: "" },
      content: { gu: "", hi: "", en: "" },
      summary: { gu: "", hi: "", en: "" },
      coverImage: "/products/VM-R01.jpg",
      showInMenu: false,
      showInFooter: true,
      seoTitle: { gu: "", hi: "", en: "" },
      seoDescription: { gu: "", hi: "", en: "" },
      isActive: true,
    });
    setActiveLangTab("gu");
    setIsModalOpen(true);
  };

  const handleEdit = (p: CustomPage) => {
    setEditingPage({
      id: p.id,
      slug: p.slug,
      title: { ...p.title },
      content: { ...p.content },
      summary: {
        gu: p.summary?.gu || "",
        hi: p.summary?.hi || "",
        en: p.summary?.en || "",
      },
      coverImage: p.coverImage,
      showInMenu: p.showInMenu,
      showInFooter: p.showInFooter,
      seoTitle: {
        gu: p.seoTitle?.gu || "",
        hi: p.seoTitle?.hi || "",
        en: p.seoTitle?.en || "",
      },
      seoDescription: {
        gu: p.seoDescription?.gu || "",
        hi: p.seoDescription?.hi || "",
        en: p.seoDescription?.en || "",
      },
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    });
    setActiveLangTab("gu");
    setIsModalOpen(true);
  };

  const handleToggleActive = async (p: CustomPage) => {
    try {
      const updated: CustomPageInput = {
        id: p.id,
        slug: p.slug,
        title: p.title,
        content: p.content,
        summary: p.summary,
        coverImage: p.coverImage,
        showInMenu: p.showInMenu,
        showInFooter: p.showInFooter,
        isActive: !p.isActive,
      };

      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setPages((prev) =>
          prev.map((item) => (item.slug === p.slug ? { ...item, isActive: !item.isActive } : item))
        );
        showNotification(p.isActive ? "Page hidden from live site" : "Page published live");
      }
    } catch (err) {
      console.error("Toggle page active error:", err);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete custom page "/pages/${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/pages?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPages((prev) => prev.filter((p) => p.slug !== slug));
        showNotification("Page deleted successfully");
      }
    } catch (err) {
      console.error("Delete page error:", err);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    if (!editingPage.slug || !editingPage.title.gu || !editingPage.content.gu) {
      alert("Please provide page slug, Gujarati title, and content body");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPage),
      });
      const data = await res.json();
      if (data.success && data.page) {
        showNotification("Page saved successfully!");
        setIsModalOpen(false);
        setEditingPage(null);
        await fetchPages();
      } else {
        alert(data.error || "Failed to save page");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save page");
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
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-black text-stone-900 dark:text-white">
              Dynamic Pages Manager (P8-T19)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 mt-1">
            Create, edit, and publish custom pages with 3-language content (GU / HI / EN), SEO metadata, slug address, and display toggles for menu and footer.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Pages List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading website pages from database...</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 space-y-4">
          <p className="text-sm text-stone-500">No custom pages found.</p>
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Create First Page
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map((p) => {
            return (
              <div
                key={p.slug}
                className={`rounded-2xl bg-white dark:bg-[#0e0e0e] border ${
                  p.isActive
                    ? "border-black/10 dark:border-white/10 shadow-sm"
                    : "border-black/5 dark:border-white/5 opacity-60"
                } p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 transition-all`}
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {p.coverImage && (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-black/10 dark:border-white/10 shrink-0">
                      <Image
                        src={p.coverImage}
                        alt={p.title.en}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 font-mono text-[10px] font-bold border border-blue-500/20">
                        /pages/{p.slug}
                      </span>
                      {p.showInMenu && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                          <MenuIcon className="w-3 h-3" />
                          <span>Menu</span>
                        </span>
                      )}
                      {p.showInFooter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                          <Globe className="w-3 h-3" />
                          <span>Footer</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                      {p.title.gu} • <span className="font-sans font-normal text-sm text-stone-600 dark:text-zinc-300">{p.title.en}</span>
                    </h3>

                    {p.summary?.gu && (
                      <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-1">
                        {p.summary.gu}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <Link
                    href={`/${locale}/pages/${p.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      p.isActive
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    {p.isActive ? (
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
                    onClick={() => handleEdit(p)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="Edit Page"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.slug)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Page Modal */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#121212] border border-black/15 dark:border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <h2 className="text-xl font-serif font-black text-stone-900 dark:text-white">
                {editingPage.id ? "Edit Custom Page" : "Create New Custom Page"}
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
              {/* Slug Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Page URL Address / Slug *
                </label>
                <div className="flex items-center rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 text-xs font-mono text-stone-500 select-none">
                    /pages/
                  </span>
                  <input
                    type="text"
                    required
                    value={editingPage.slug}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    placeholder="e.g. flower-care-tips, wedding-checklist"
                    className="w-full py-2.5 pr-3 bg-transparent text-sm font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Language Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Content per Language (GU / HI / EN)
                  </span>
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                    {(["gu", "hi", "en"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLangTab(lang)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeLangTab === lang
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        {lang === "gu" ? "ગુજરાતી" : lang === "hi" ? "हिन्दी" : "English"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Page Title ({activeLangTab.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required={activeLangTab === "gu"}
                    value={editingPage.title[activeLangTab]}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        title: { ...editingPage.title, [activeLangTab]: e.target.value },
                      })
                    }
                    placeholder={
                      activeLangTab === "gu"
                        ? "જેમ કે: તાજા ફૂલો અને વરમાળાની સંભાળ માર્ગદર્શિકા"
                        : "e.g. Fresh Wedding Flower Care Guide"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-sm focus:outline-blue-500"
                  />
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Short Summary / Subtitle ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={editingPage.summary?.[activeLangTab] || ""}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        summary: {
                          gu: editingPage.summary?.gu || "",
                          hi: editingPage.summary?.hi || "",
                          en: editingPage.summary?.en || "",
                          [activeLangTab]: e.target.value,
                        },
                      })
                    }
                    placeholder="Short introduction under heading..."
                    className="w-full px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs focus:outline-blue-500"
                  />
                </div>

                {/* Content Body */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Page Content Body ({activeLangTab.toUpperCase()}) *
                  </label>
                  <textarea
                    rows={8}
                    required={activeLangTab === "gu"}
                    value={editingPage.content[activeLangTab]}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        content: { ...editingPage.content, [activeLangTab]: e.target.value },
                      })
                    }
                    placeholder="Write page content paragraphs. Markdown headers like ### Heading 3 and #### Heading 4 are supported..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs sm:text-sm font-sans focus:outline-blue-500"
                  />
                </div>

                {/* SEO fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      SEO Meta Title ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={editingPage.seoTitle?.[activeLangTab] || ""}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          seoTitle: {
                            gu: editingPage.seoTitle?.gu || "",
                            hi: editingPage.seoTitle?.hi || "",
                            en: editingPage.seoTitle?.en || "",
                            [activeLangTab]: e.target.value,
                          },
                        })
                      }
                      placeholder="Title for Google search results..."
                      className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      SEO Meta Description ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={editingPage.seoDescription?.[activeLangTab] || ""}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          seoDescription: {
                            gu: editingPage.seoDescription?.gu || "",
                            hi: editingPage.seoDescription?.hi || "",
                            en: editingPage.seoDescription?.en || "",
                            [activeLangTab]: e.target.value,
                          },
                        })
                      }
                      placeholder="Summary snippet for Google..."
                      className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Cover Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={editingPage.coverImage || ""}
                  onChange={(e) =>
                    setEditingPage({ ...editingPage, coverImage: e.target.value })
                  }
                  placeholder="/products/VM-R01.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs"
                />

                <div className="flex items-center gap-4">
                  {editingPage.coverImage && (
                    <div className="relative w-20 h-12 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 border shrink-0">
                      <Image
                        src={editingPage.coverImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-500 uppercase font-semibold">
                      Presets:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_PAGE_IMAGES.map((p) => (
                        <button
                          key={p.url}
                          type="button"
                          onClick={() =>
                            setEditingPage({
                              ...editingPage,
                              coverImage: p.url,
                            })
                          }
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-zinc-300 cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Display & Active Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-black/10 dark:border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.showInMenu}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, showInMenu: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-stone-800 dark:text-white">
                    Show in Navigation Menu
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.showInFooter}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, showInFooter: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-stone-800 dark:text-white">
                    Show in Website Footer
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.isActive}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-stone-800 dark:text-white">
                    Publish Page (Active)
                  </span>
                </label>
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
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingPage.id ? "Update Page" : "Save & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
