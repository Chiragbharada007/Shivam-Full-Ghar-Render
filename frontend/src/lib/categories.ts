import { gatewayFetch } from "@/lib/gateway";

export interface LocalizedCategoryText {
  gu: string;
  hi: string;
  en: string;
}

export interface StoreCategory {
  id: string;
  slug: string;
  name: LocalizedCategoryText;
  description: LocalizedCategoryText;
  coverImage: string;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  seoTitle?: LocalizedCategoryText;
  seoDescription?: LocalizedCategoryText;
}

export interface CategoryInputPayload {
  id?: string;
  slug: string;
  name: LocalizedCategoryText;
  description?: LocalizedCategoryText;
  coverImage?: string;
  sortOrder?: number;
  isActive?: boolean;
  seoTitle?: LocalizedCategoryText;
  seoDescription?: LocalizedCategoryText;
}

export const DEFAULT_STORE_CATEGORIES: StoreCategory[] = [
  {
    id: "cat-varmala",
    slug: "varmala-garlands",
    name: { gu: "લગ્ન વરમાળા", hi: "विवाह वरमाला", en: "Royal Varmala" },
    description: {
      gu: "રોયલ તાજા લાલ ગુલાબ અને ઓર્કિડ વરમાળા",
      hi: "शाही ताजे लाल गुलाब और ऑर्किड वरमाला",
      en: "Sacred handcrafted wedding garlands for bride & groom",
    },
    coverImage: "/products/VM-R01.jpg",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "cat-car-decoration",
    slug: "car-decoration",
    name: { gu: "વેડિંગ કાર સજાવટ", hi: "वेडिंग कार सजावट", en: "Car Decoration" },
    description: {
      gu: "દુલ્હન કાર માટે તાજા ફૂલોનું ડેકોરેશન",
      hi: "दुल्हन कार के लिए ताजे फूलों की सजावट",
      en: "Bridal car floral decoration with roses & orchids",
    },
    coverImage: "/products/CD-01.jpg",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-mandap",
    slug: "mandap-stage",
    name: { gu: "મંડપ અને સ્ટેજ", hi: "मंडप और स्टेज", en: "Mandap & Stage" },
    description: {
      gu: "લગ્ન મંડપ અને સ્ટેજ ફ્લોરલ સજાવટ",
      hi: "विवाह मंडप और स्टेज फ्लोरल सजावट",
      en: "Traditional marigold and rose mandap decor",
    },
    coverImage: "/products/hero-wedding.jpg",
    sortOrder: 2,
    isActive: true,
  },
];

export async function getStorefrontCategories(): Promise<StoreCategory[]> {
  const res = await gatewayFetch<{ success: boolean; categories: any[] }>("/api/categories?locale=en");
  if (!res?.success || !res.categories?.length) {
    return DEFAULT_STORE_CATEGORIES;
  }

  return res.categories.map((c: any) => ({
    id: c.id,
    slug: c.slug,
    name: {
      gu: c.translations?.gu?.name || c.name || c.slug,
      hi: c.translations?.hi?.name || c.name || c.slug,
      en: c.translations?.en?.name || c.name || c.slug,
    },
    description: {
      gu: c.translations?.gu?.description || c.description || "",
      hi: c.translations?.hi?.description || c.description || "",
      en: c.translations?.en?.description || c.description || "",
    },
    coverImage: c.coverImage || "/products/VM-R01.jpg",
    sortOrder: c.sortOrder || 0,
    isActive: c.isActive !== false,
  }));
}
