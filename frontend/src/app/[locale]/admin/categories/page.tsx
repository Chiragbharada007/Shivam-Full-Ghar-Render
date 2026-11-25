"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Check,
  X,
  Loader2,
  Package,
} from "lucide-react";
import { StoreCategory, CategoryInputPayload } from "@/lib/categories";

const PRESET_CATEGORY_IMAGES = [
  { label: "Royal Varmala", url: "/products/VM-R01.jpg" },
  { label: "Car Decoration", url: "/products/CR-01.jpg" },
  { label: "Bridal Veni", url: "/products/HF-01.jpg" },
  { label: "Mogra Gajra", url: "/products/GJ-01.jpg" },
  { label: "Floral Jewellery", url: "/products/FJ-01.jpg" },
  { label: "Grand Wedding Hero", url: "/products/hero-wedding.jpg" },
];

export default function AdminCategoriesPage() {
  const locale = useLocale();
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInputPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<"gu" | "hi" | "en">("gu");
  const [notification, setNotification] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNew = () => {
    setEditingCategory({
      slug: "",
      name: { gu: "", hi: "", en: "" },
      description: { gu: "", hi: "", en: "" },
      coverImage: "/products/VM-R01.jpg",
      isActive: true,
    });
    setActiveLangTab("gu");
    setIsModalOpen(true);
  };

  const handleEdit = (cat: StoreCategory) => {
    setEditingCategory({
      id: cat.id,
      slug: cat.slug,
      name: { ...cat.name },
      description: { ...cat.description },
      coverImage: cat.coverImage,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    });
    setActiveLangTab("gu");
    setIsModalOpen(true);
  };

  const handleToggleActive = async (cat: StoreCategory) => {
    try {
      const updated: CategoryInputPayload = {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        coverImage: cat.coverImage,
        sortOrder: cat.sortOrder,
        isActive: !cat.isActive,
      };

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) =>
          prev.map((c) => (c.slug === cat.slug ? { ...c, isActive: !c.isActive } : c))
        );
        showNotification(cat.isActive ? "Category hidden from store" : "Category activated in store");
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete category "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.slug !== slug));
        showNotification("Category deleted successfully");
      }
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const reordered = [...categories];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    setCategories(reordered);

    try {
      const slugs = reordered.map((c) => c.slug);
      await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs }),
      });
      showNotification("Category order updated");
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    if (!editingCategory.slug || !editingCategory.name.gu) {
      alert("Please provide category slug and Gujarati name");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      const data = await res.json();
      if (data.success && data.category) {
        showNotification("Category saved successfully!");
        setIsModalOpen(false);
        setEditingCategory(null);
        await fetchCategories();
      } else {
        alert(data.error || "Failed to save category");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save category");
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
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-black text-stone-900 dark:text-white">
              Dynamic Categories Manager (P8-T18)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 mt-1">
            All categories come directly from PostgreSQL. Add, edit, hide, and reorder categories. Changes automatically update the menu, storefront filters, home tiles, and sitemap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/shop`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Shop</span>
          </Link>
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
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

      {/* Categories List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading categories from database...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 space-y-4">
          <p className="text-sm text-stone-500">No categories found in database.</p>
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((c, idx) => {
            return (
              <div
                key={c.slug}
                className={`rounded-2xl bg-white dark:bg-[#0e0e0e] border ${
                  c.isActive
                    ? "border-black/10 dark:border-white/10 shadow-sm"
                    : "border-black/5 dark:border-white/5 opacity-60"
                } p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 transition-all`}
              >
                {/* Left: Reorder controls + Category Cover Photo */}
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
                      disabled={idx === categories.length - 1}
                      onClick={() => handleMoveOrder(idx, "down")}
                      className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-black/10 dark:border-white/10 shrink-0">
                    <Image
                      src={c.coverImage || "/products/VM-R01.jpg"}
                      alt={c.name.en}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </div>

                {/* Center: Details */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 font-mono text-[10px] font-bold border border-rose-500/20">
                      slug: {c.slug}
                    </span>
                    {typeof c.productCount === "number" && (
                      <span className="inline-flex items-center gap-1 text-xs text-stone-500 dark:text-zinc-400">
                        <Package className="w-3.5 h-3.5 text-stone-400" />
                        <span>{c.productCount} products</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                    {c.name.gu} • <span className="font-sans font-normal text-sm text-stone-600 dark:text-zinc-300">{c.name.en}</span>
                  </h3>

                  {c.name.hi && (
                    <div className="text-xs text-stone-500 dark:text-zinc-400">
                      हिन्दी: {c.name.hi}
                    </div>
                  )}

                  {c.description?.gu && (
                    <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-1">
                      {c.description.gu}
                    </p>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <Link
                    href={`/${locale}/shop?category=${c.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="View in Shop"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      c.isActive
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    {c.isActive ? (
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
                    onClick={() => handleEdit(c)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(c.slug)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#121212] border border-black/15 dark:border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <h2 className="text-xl font-serif font-black text-stone-900 dark:text-white">
                {editingCategory.id ? "Edit Category" : "Add New Category"}
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
                  Category URL Slug (Unique Identifier) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  disabled={Boolean(editingCategory.id)}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  placeholder="e.g. garlands, car-decoration, haldi-specials"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-sm font-mono focus:outline-rose-500 disabled:opacity-60"
                />
                <span className="text-[10px] text-stone-500">
                  Storefront URL: /shop?category={editingCategory.slug || "your-slug"}
                </span>
              </div>

              {/* Language Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Category Name & Description (GU / HI / EN)
                  </span>
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                    {(["gu", "hi", "en"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLangTab(lang)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeLangTab === lang
                            ? "bg-rose-600 text-white shadow-xs"
                            : "text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        {lang === "gu" ? "ગુજરાતી" : lang === "hi" ? "हिन्दी" : "English"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Category Name ({activeLangTab.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required={activeLangTab === "gu"}
                    value={editingCategory.name[activeLangTab]}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: { ...editingCategory.name, [activeLangTab]: e.target.value },
                      })
                    }
                    placeholder={
                      activeLangTab === "gu"
                        ? "જેમ કે: લગ્ન વરમાળા"
                        : "e.g. Wedding Garlands"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-sm focus:outline-rose-500"
                  />
                </div>

                {/* Category Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Category Description ({activeLangTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={editingCategory.description?.[activeLangTab] || ""}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        description: {
                          gu: editingCategory.description?.gu || "",
                          hi: editingCategory.description?.hi || "",
                          en: editingCategory.description?.en || "",
                          [activeLangTab]: e.target.value,
                        },
                      })
                    }
                    placeholder="Short description for card subtitle and SEO..."
                    className="w-full px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-sm focus:outline-rose-500"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Cover Photo URL *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.coverImage || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, coverImage: e.target.value })
                  }
                  placeholder="/products/VM-R01.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-stone-50 dark:bg-stone-900 text-xs"
                />

                <div className="flex items-center gap-4">
                  {editingCategory.coverImage && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 border shrink-0">
                      <Image
                        src={editingCategory.coverImage}
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
                      {PRESET_CATEGORY_IMAGES.map((p) => (
                        <button
                          key={p.url}
                          type="button"
                          onClick={() =>
                            setEditingCategory({
                              ...editingCategory,
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

              {/* Active Toggle */}
              <div className="pt-2 border-t border-black/10 dark:border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-stone-800 dark:text-white">
                    Show Category on Storefront (Active)
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
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCategory.id ? "Update Category" : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
