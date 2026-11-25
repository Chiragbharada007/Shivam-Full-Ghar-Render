"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  X,
  AlertCircle,
  RefreshCw,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { AdminProductView } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

interface ProductManagerProps {
  initialProducts: AdminProductView[];
  locale?: string;
}

const CATEGORIES = [
  { slug: "garlands", name: "Wedding Garlands (વરમાળા)" },
  { slug: "car-decoration", name: "Car Decoration (કાર સજાવટ)" },
  { slug: "hair-flowers", name: "Hair Flowers / Veni (વેણી)" },
  { slug: "gajra", name: "Gajra (ગજરા)" },
  { slug: "floral-jewellery", name: "Floral Jewellery (ફૂલોના ઘરેણાં)" },
];

const COLOURS = [
  { slug: "red", name: "Red (લાલ)", hex: "#be185d" },
  { slug: "yellow", name: "Yellow (પીળો)", hex: "#eab308" },
  { slug: "white", name: "White (સફેદ)", hex: "#f8fafc" },
  { slug: "pink", name: "Pink (ગુલાબી)", hex: "#ec4899" },
  { slug: "orange", name: "Orange (કેસરી)", hex: "#f97316" },
  { slug: "multicolour", name: "Multicolour (બહુરંગી)", hex: "#8b5cf6" },
];

const PRESET_IMAGES = [
  { url: "/products/VM-R01.jpg", label: "Red Rose Royal Varmala" },
  { url: "/products/VM-W01.jpg", label: "White Jasmine Pearl Varmala" },
  { url: "/products/VM-P01.jpg", label: "Pink Rose Blush Varmala" },
  { url: "/products/VM-Y01.jpg", label: "Marigold Sunshine Varmala" },
  { url: "/products/VM-M01.jpg", label: "Rainbow Festive Varmala" },
  { url: "/products/VM-R02.jpg", label: "Grand Rose & Orchid 5ft" },
  { url: "/products/CR-01.jpg", label: "Car Bonnet Bouquet" },
  { url: "/products/CR-02.jpg", label: "Full Car Rose Decoration" },
  { url: "/products/CR-03.jpg", label: "Luxury V-Shape Bonnet" },
  { url: "/products/HF-01.jpg", label: "Bridal Rose Veni" },
  { url: "/products/GJ-01.jpg", label: "Classic Mogra Gajra" },
  { url: "/products/FJ-01.jpg", label: "Bridal Floral Jewellery Set" },
  { url: "/products/hero-wedding.jpg", label: "Traditional Wedding Garlands" },
];

export function ProductManager({ initialProducts, locale = "gu" }: ProductManagerProps) {
  const [products, setProducts] = useState<AdminProductView[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("shivam_custom_products");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {}
  }, []);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductView | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    nameGu: "",
    nameHi: "",
    nameEn: "",
    categorySlug: "garlands",
    colourSlug: "red",
    basePrice: 2800,
    mrp: 3500,
    prepTimeDays: 2,
    unit: "pair",
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT" | "HIDDEN",
    imageUrl: "/products/VM-R01.jpg",
    secondaryImageUrl: "",
    descriptionGu: "",
    descriptionHi: "",
    descriptionEn: "",
  });

  // Image Upload / Import State
  const [imageTab, setImageTab] = useState<"upload" | "url" | "preset">("preset");
  const [externalUrlInput, setExternalUrlInput] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.nameGu.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q);

      const matchCat = selectedCategory === "all" || p.categorySlug === selectedCategory;
      const matchStatus = selectedStatus === "all" || p.status === selectedStatus;

      return matchSearch && matchCat && matchStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      code: `VM-K0${products.length + 1}`,
      nameGu: "",
      nameHi: "",
      nameEn: "",
      categorySlug: "garlands",
      colourSlug: "red",
      basePrice: 2800,
      mrp: 3500,
      prepTimeDays: 2,
      unit: "pair",
      status: "PUBLISHED",
      imageUrl: "/products/VM-R01.jpg",
      secondaryImageUrl: "",
      descriptionGu: "તાજા ગુલાબ અને મોગરાની ઉત્કૃષ્ટ હસ્તકળા ડિઝાઇન.",
      descriptionHi: "ताजे गुलाब और मोगरा से तैयार की गई सुंदर वरमाला।",
      descriptionEn: "Handcrafted fresh Indian roses and fragrant mogra petals.",
    });
    setImageTab("preset");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: AdminProductView) => {
    setEditingProduct(p);
    setFormData({
      code: p.code,
      nameGu: p.nameGu,
      nameHi: p.nameHi,
      nameEn: p.nameEn,
      categorySlug: p.categorySlug,
      colourSlug: p.colourSlug || "red",
      basePrice: p.basePrice,
      mrp: p.mrp || Math.round(p.basePrice * 1.25),
      prepTimeDays: p.prepTimeDays,
      unit: p.unit || "pair",
      status: p.status,
      imageUrl: p.imageUrl,
      secondaryImageUrl: p.secondaryImageUrl || "",
      descriptionGu: p.descriptionGu || "",
      descriptionHi: p.descriptionHi || "",
      descriptionEn: p.descriptionEn || "",
    });
    setImageTab("preset");
    setIsModalOpen(true);
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, imageUrl: json.url }));
        showToast("Image uploaded successfully!");
      } else {
        showToast(json.message || "Failed to upload image", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Image upload failed", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle URL Import
  const handleUrlImport = async () => {
    if (!externalUrlInput) return;
    setUploadLoading(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: externalUrlInput }),
      });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, imageUrl: json.url }));
        setExternalUrlInput("");
        showToast("Image imported successfully!");
      } else {
        showToast(json.message || "Could not import image", "error");
      }
    } catch (err: any) {
      showToast(err.message || "URL import error", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  // Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.nameGu || !formData.basePrice) {
      showToast("Code, Gujarati Name, and Base Price are required", "error");
      return;
    }

    setUploadLoading(true);
    try {
      if (editingProduct) {
        // PUT /api/admin/products/[id]
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success && json.product) {
          setProducts((prev) => {
            const updated = prev.map((item) => (item.id === editingProduct.id ? json.product : item));
            try {
              localStorage.setItem("shivam_custom_products", JSON.stringify(updated));
              window.dispatchEvent(new Event("products-updated"));
            } catch (e) {}
            return updated;
          });
          setIsModalOpen(false);
          showToast(`Product ${formData.code} updated successfully!`);
        } else {
          showToast(json.message || "Failed to update product", "error");
        }
      } else {
        // POST /api/admin/products
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success && json.product) {
          setProducts((prev) => {
            const updated = [json.product, ...prev];
            try {
              localStorage.setItem("shivam_custom_products", JSON.stringify(updated));
              window.dispatchEvent(new Event("products-updated"));
            } catch (e) {}
            return updated;
          });
          setIsModalOpen(false);
          showToast(`New design ${formData.code} added to live catalog!`);
        } else {
          showToast(json.message || "Failed to add product", "error");
        }
      }
    } catch (err: any) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setProducts((prev) => {
          const updated = prev.filter((p) => p.id !== id);
          try {
            localStorage.setItem("shivam_custom_products", JSON.stringify(updated));
            window.dispatchEvent(new Event("products-updated"));
          } catch (e) {}
          return updated;
        });
        setDeleteConfirmId(null);
        showToast("Product deleted successfully!");
      } else {
        showToast(json.message || "Could not delete product", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Delete error", "error");
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (p: AdminProductView) => {
    const nextStatus: "PUBLISHED" | "DRAFT" = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setProducts((prev) => {
          const updated: AdminProductView[] = prev.map((item) =>
            item.id === p.id ? { ...item, status: nextStatus } : item
          );
          try {
            localStorage.setItem("shivam_custom_products", JSON.stringify(updated));
            window.dispatchEvent(new Event("products-updated"));
          } catch (e) {}
          return updated;
        });
        showToast(`Status changed to ${nextStatus}`);
      }
    } catch (err: any) {
      showToast("Failed to toggle status", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-300 ${
            toastMessage.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-800"
              : "bg-rose-950 text-rose-100 border-rose-800"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0c0c0c] p-6 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-black text-stone-900 dark:text-white">
              Floral Products Catalogue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 font-bold text-xs">
              {products.length} Designs
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Live PostgreSQL catalogue • Handcrafted fresh wedding garlands, car bouquets & veni designs
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-900 hover:to-rose-950 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Flower Design</span>
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0c0c0c] p-4 rounded-2xl border border-stone-200 dark:border-white/10 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 dark:text-zinc-400 block">Total Designs</span>
          <span className="text-2xl font-serif font-black text-stone-900 dark:text-white mt-0.5 block">
            {products.length}
          </span>
        </div>
        <div className="bg-white dark:bg-[#0c0c0c] p-4 rounded-2xl border border-stone-200 dark:border-white/10 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 block">Published on Website</span>
          <span className="text-2xl font-serif font-black text-emerald-800 dark:text-emerald-400 mt-0.5 block">
            {products.filter((p) => p.status === "PUBLISHED").length}
          </span>
        </div>
        <div className="bg-white dark:bg-[#0c0c0c] p-4 rounded-2xl border border-stone-200 dark:border-white/10 shadow-2xs">
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 block">Draft / Hidden</span>
          <span className="text-2xl font-serif font-black text-amber-800 dark:text-amber-400 mt-0.5 block">
            {products.filter((p) => p.status !== "PUBLISHED").length}
          </span>
        </div>
        <div className="bg-white dark:bg-[#0c0c0c] p-4 rounded-2xl border border-stone-200 dark:border-white/10 shadow-2xs">
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 block">Same-Day / 1-Day Prep</span>
          <span className="text-2xl font-serif font-black text-rose-900 dark:text-rose-400 mt-0.5 block">
            {products.filter((p) => p.prepTimeDays <= 1).length}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-[#0c0c0c] p-3.5 rounded-2xl border border-stone-200 dark:border-white/10 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code (e.g. VM-R01), Gujarati name, category..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 dark:bg-zinc-900 hover:bg-stone-100/80 dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-black rounded-xl border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:border-rose-800 focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-zinc-200 font-medium focus:border-rose-800 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-zinc-200 font-medium focus:border-rose-800 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#0c0c0c] rounded-3xl border border-stone-200 dark:border-white/10 overflow-hidden shadow-xs">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-stone-800 dark:text-zinc-100 text-base">No flower designs found</h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-sm mx-auto">
              No products match your current search or category filter. Try clearing filters or create a new design.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-rose-900 text-white text-xs font-semibold"
            >
              Add New Flower Design
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50/80 dark:bg-zinc-900/80 text-stone-500 dark:text-zinc-400 font-semibold border-b border-stone-200 dark:border-white/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Photo</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Design Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Prep Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                {filteredProducts.map((p) => (
                  <tr key={p.id || p.code} className="hover:bg-amber-50/40 dark:hover:bg-white/5 transition-colors group">
                    {/* Thumbnail */}
                    <td className="p-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-white/10 relative shrink-0">
                        <img
                          src={p.imageUrl || "/products/VM-R01.jpg"}
                          alt={p.nameGu}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        />
                      </div>
                    </td>

                    {/* Code */}
                    <td className="p-4 font-mono font-bold text-stone-900 dark:text-white">{p.code}</td>

                    {/* Names */}
                    <td className="p-4">
                      <div className="font-semibold text-stone-900 dark:text-white text-sm">{p.nameGu}</div>
                      {p.nameEn && p.nameEn !== p.nameGu && (
                        <div className="text-[11px] text-stone-500 dark:text-zinc-400">{p.nameEn}</div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-[11px] font-medium border border-stone-200 dark:border-white/10">
                        {p.categoryName}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div className="font-serif font-black text-rose-900 dark:text-rose-400 text-sm">
                        {formatPrice(p.basePrice)}
                      </div>
                      {p.mrp && p.mrp > p.basePrice && (
                        <div className="text-[10px] text-stone-400 dark:text-zinc-500 line-through">
                          {formatPrice(p.mrp)}
                        </div>
                      )}
                    </td>

                    {/* Prep Time */}
                    <td className="p-4 text-stone-600 dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400 dark:text-zinc-500" />
                        <span>{p.prepTimeDays} {p.prepTimeDays === 1 ? "day" : "days"}</span>
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 transition-all ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900"
                            : "bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {p.status === "PUBLISHED" ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>PUBLISHED</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>{p.status}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/${locale}/product/${p.code}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors"
                          title="Edit Flower Design"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg text-rose-500 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Flower Design"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0c] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200 dark:border-white/10 animate-in zoom-in-95 text-stone-900 dark:text-white">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-serif font-bold text-stone-900 dark:text-white text-lg">
                Delete Flower Design?
              </h3>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                This will remove the product from your store catalogue and database. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-zinc-300 font-semibold text-xs hover:bg-stone-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0c0c0c] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 dark:border-white/10 animate-in zoom-in-95 my-8 text-stone-900 dark:text-white">
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 flex items-center justify-center font-bold text-lg">
                    🌸
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-black text-stone-900 dark:text-white">
                      {editingProduct ? "Edit Floral Product" : "Add New Floral Design"}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-zinc-400">
                      Syncs directly with your live PostgreSQL store catalogue
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                {/* Product Code & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1">
                      Product Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. VM-R01, CR-04"
                      className="w-full px-3.5 py-2 text-xs font-mono font-bold bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-white/15 rounded-xl text-stone-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-rose-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.categorySlug}
                      onChange={(e) =>
                        setFormData({ ...formData, categorySlug: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-white/15 rounded-xl text-stone-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-rose-800 focus:outline-hidden"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1">
                      Primary Colour
                    </label>
                    <select
                      value={formData.colourSlug}
                      onChange={(e) =>
                        setFormData({ ...formData, colourSlug: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-white/15 rounded-xl text-stone-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-rose-800 focus:outline-hidden"
                    >
                      {COLOURS.map((col) => (
                        <option key={col.slug} value={col.slug}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Multilingual Names */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1">
                      ગુજરાતી નામ (Gujarati Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameGu}
                      onChange={(e) => setFormData({ ...formData, nameGu: e.target.value })}
                      placeholder="e.g. રોયલ ગુલાબ વરમાળા"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-white/15 rounded-xl text-stone-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-rose-800 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1">
                      English Name
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="e.g. Royal Rose Varmala (pair)"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-white/15 rounded-xl text-stone-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-rose-800 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1">
                      हिंदी नाम (Hindi Name)
                    </label>
                    <input
                      type="text"
                      value={formData.nameHi}
                      onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                      placeholder="e.g. रॉयल गुलाब वरमाला"
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-white/15 rounded-xl text-stone-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-rose-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Pricing & Prep Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/50 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-amber-200/60 dark:border-white/10">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1">
                      Base Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, basePrice: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 text-xs font-serif font-black text-rose-900 dark:text-rose-400 bg-white dark:bg-black border border-amber-300 dark:border-white/15 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1">
                      MRP / Strike Price (₹)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.mrp}
                      onChange={(e) =>
                        setFormData({ ...formData, mrp: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 text-xs text-stone-600 dark:text-zinc-400 bg-white dark:bg-black border border-stone-300 dark:border-white/15 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1">
                      Prep Time (Days)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={14}
                      value={formData.prepTimeDays}
                      onChange={(e) =>
                        setFormData({ ...formData, prepTimeDays: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 text-xs text-stone-900 dark:text-white bg-white dark:bg-black border border-stone-300 dark:border-white/15 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs text-stone-900 dark:text-white bg-white dark:bg-black border border-stone-300 dark:border-white/15 rounded-lg focus:outline-hidden"
                    >
                      <option value="pair">Pair (જોડ)</option>
                      <option value="piece">Piece (પીસ)</option>
                      <option value="set">Set (સેટ)</option>
                      <option value="meter">Meter (મીટર)</option>
                    </select>
                  </div>
                </div>

                {/* IMAGE UPLOAD & IMPORT SYSTEM */}
                <div className="space-y-3 p-4 rounded-2xl bg-stone-50 dark:bg-zinc-900/60 border border-stone-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase">
                      Product Photography & Image Import *
                    </label>
                    <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-zinc-800 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setImageTab("preset")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          imageTab === "preset"
                            ? "bg-white dark:bg-zinc-900 text-stone-900 dark:text-white shadow-2xs"
                            : "text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white"
                        }`}
                      >
                        Preset Gallery
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab("upload")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          imageTab === "upload"
                            ? "bg-white dark:bg-zinc-900 text-stone-900 dark:text-white shadow-2xs"
                            : "text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white"
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab("url")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          imageTab === "url"
                            ? "bg-white dark:bg-zinc-900 text-stone-900 dark:text-white shadow-2xs"
                            : "text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white"
                        }`}
                      >
                        Web URL Import
                      </button>
                    </div>
                  </div>

                  {/* Active Image Preview & Input */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white dark:bg-black border border-stone-300 dark:border-white/10 relative shrink-0 shadow-xs">
                      <img
                        src={formData.imageUrl || "/products/VM-R01.jpg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      {imageTab === "preset" && (
                        <div>
                          <p className="text-[11px] text-stone-500 dark:text-zinc-400 mb-2">
                            Select authentic benchmark photo from FloralHub & Floriwish library:
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-white dark:bg-black rounded-xl border border-stone-200 dark:border-white/10">
                            {PRESET_IMAGES.map((img) => (
                              <button
                                key={img.url}
                                type="button"
                                onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                                  formData.imageUrl === img.url
                                    ? "border-rose-800 ring-2 ring-rose-300 scale-102"
                                    : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                                title={img.label}
                              >
                                <img
                                  src={img.url}
                                  alt={img.label}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {imageTab === "upload" && (
                        <div>
                          <label className="border-2 border-dashed border-stone-300 dark:border-white/20 hover:border-rose-700 bg-white dark:bg-black p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors">
                            <Upload className="w-6 h-6 text-stone-400 mb-1" />
                            <span className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                              {uploadLoading ? "Uploading image..." : "Click or drag photo here to upload"}
                            </span>
                            <span className="text-[10px] text-stone-400 dark:text-zinc-500">
                              JPEG, PNG, WEBP up to 10MB
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadLoading}
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      {imageTab === "url" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              value={externalUrlInput}
                              onChange={(e) => setExternalUrlInput(e.target.value)}
                              placeholder="https://example.com/flower-garland.jpg"
                              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-black border border-stone-300 dark:border-white/15 text-stone-900 dark:text-white rounded-xl focus:border-rose-800 focus:outline-hidden"
                            />
                            <button
                              type="button"
                              onClick={handleUrlImport}
                              disabled={uploadLoading || !externalUrlInput}
                              className="px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 disabled:opacity-50"
                            >
                              Import
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-500 dark:text-zinc-400">
                            Paste direct image URL from FloralHub, Floriwish, Pinterest, or your cloud storage.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1">
                      વર્ણન (Gujarati Description)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.descriptionGu}
                      onChange={(e) =>
                        setFormData({ ...formData, descriptionGu: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-white/15 text-stone-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-black focus:border-rose-800 focus:outline-hidden resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1">
                      Catalogue Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "PUBLISHED" | "DRAFT" | "HIDDEN",
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-white/15 text-stone-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-black focus:border-rose-800 focus:outline-hidden font-semibold"
                    >
                      <option value="PUBLISHED">PUBLISHED (Visible to Customers)</option>
                      <option value="DRAFT">DRAFT (Admin Only)</option>
                      <option value="HIDDEN">HIDDEN (Archived)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-zinc-300 font-semibold text-xs hover:bg-stone-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-900 hover:to-rose-950 text-white font-semibold text-xs shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {uploadLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
