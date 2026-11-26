import { cookies } from "next/headers";
import { CATALOG_PRODUCTS, ProductCatalogItem } from "@/lib/catalog";
import { gatewayFetch } from "@/lib/gateway";

export interface AdminProductView {
  id: string;
  code: string;
  nameGu: string;
  nameHi: string;
  nameEn: string;
  categorySlug: string;
  categoryName: string;
  colourSlug: string;
  colourName: string;
  basePrice: number;
  mrp: number;
  prepTimeDays: number;
  unit: string;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
  imageUrl: string;
  secondaryImageUrl?: string;
  descriptionGu: string;
  descriptionHi: string;
  descriptionEn: string;
  flowersUsedGu?: string;
  flowersUsedHi?: string;
  flowersUsedEn?: string;
  sortOrder: number;
  updatedAt?: string;
}

function normalizeCategory(slug?: string): ProductCatalogItem["category"] {
  return (slug || "garlands") as ProductCatalogItem["category"];
}

function mapApiProductToCatalog(p: any): ProductCatalogItem {
  const tr = p.translations || {};
  const cat = normalizeCategory(p.categorySlug);
  return {
    id: p.id,
    code: p.code,
    name: {
      gu: tr.gu?.name || p.name || p.code,
      hi: tr.hi?.name || p.name || p.code,
      en: tr.en?.name || p.name || p.code,
    },
    category: cat,
    categoryName: {
      gu: p.categoryName || "લગ્ન વરમાળા",
      hi: p.categoryName || "विवाह वरमाला",
      en: p.categoryName || "Wedding Garlands",
    },
    colour: "red",
    price: Math.round((p.salePrice || p.basePrice || 0) / 100),
    mrp: Math.round((p.basePrice || 0) / 100),
    prepDays: p.prepTimeDays || 2,
    image: p.imageUrl || "/products/VM-R01.jpg",
    secondaryImage: p.images?.[1]?.url || p.imageUrl || "/products/VM-R01.jpg",
    rating: 4.9,
    reviewsCount: 24,
    pairInfo: {
      gu: p.unit === "pair" ? "૨ નંગ (જોડી)" : "૧ સેટ",
      hi: p.unit === "pair" ? "२ नग (जोड़ी)" : "१ सेट",
      en: p.unit === "pair" ? "1 Pair (2 Garlands)" : "1 Set",
    },
    flowersUsed: {
      gu: "તાજા ગુલાબ અને ઓર્કિડ્સ",
      hi: "ताजे गुलाब और ऑर्किड",
      en: "Fresh Dutch Roses & Orchids",
    },
    description: {
      gu: tr.gu?.description || p.description || "",
      hi: tr.hi?.description || p.description || "",
      en: tr.en?.description || p.description || "",
    },
    options: (p.options || []).map((o: any, idx: number) => ({
      id: o.id || `opt-${idx}`,
      label: o.label,
      priceAdd: Math.round((o.priceAdd || 0) / 100),
    })),
  };
}

export async function getStorefrontProducts(filters?: {
  locale?: string;
  category?: string;
  colour?: string;
  sort?: string;
}): Promise<ProductCatalogItem[]> {
  const locale = filters?.locale || "en";
  const res = await gatewayFetch<{ success: boolean; products: any[] }>(
    `/api/products?locale=${encodeURIComponent(locale)}`
  );
  let items = res?.success && res.products?.length ? res.products.map(mapApiProductToCatalog) : [...CATALOG_PRODUCTS];

  if (filters?.category) {
    items = items.filter((p) => p.category === filters.category);
  }
  if (filters?.colour) {
    items = items.filter((p) => p.colour === filters.colour);
  }
  if (filters?.sort === "price_asc") {
    items.sort((a, b) => a.price - b.price);
  } else if (filters?.sort === "price_desc") {
    items.sort((a, b) => b.price - a.price);
  }
  return items;
}

export async function getProductByCode(code: string): Promise<ProductCatalogItem | null> {
  const res = await gatewayFetch<{ success: boolean; product: any }>(
    `/api/products/${encodeURIComponent(code)}?locale=en`
  );
  if (res?.success && res.product) {
    return mapApiProductToCatalog(res.product);
  }
  return CATALOG_PRODUCTS.find((p) => p.code.toLowerCase() === code.toLowerCase()) || null;
}

export async function getAdminProducts(): Promise<AdminProductView[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sfg_admin_token")?.value;
  const res = await gatewayFetch<{ success: boolean; products: any[] }>("/api/admin/products", {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res?.success || !res.products) {
    return [];
  }

  return res.products.map((p: any, idx: number) => {
    const tr = p.translations || {};
    return {
      id: p.id,
      code: p.code,
      nameGu: tr.gu?.name || p.name || p.code,
      nameHi: tr.hi?.name || p.name || p.code,
      nameEn: tr.en?.name || p.name || p.code,
      categorySlug: p.categorySlug || "",
      categoryName: p.categoryName || p.categorySlug || "",
      colourSlug: "red",
      colourName: "Red",
      basePrice: Math.round((p.salePrice || p.basePrice || 0) / 100),
      mrp: Math.round((p.basePrice || 0) / 100),
      prepTimeDays: p.prepTimeDays || 2,
      unit: p.unit || "pair",
      status: p.status || "PUBLISHED",
      imageUrl: p.imageUrl || "/products/VM-R01.jpg",
      descriptionGu: tr.gu?.description || "",
      descriptionHi: tr.hi?.description || "",
      descriptionEn: tr.en?.description || "",
      sortOrder: p.sortOrder ?? idx,
    };
  });
}
