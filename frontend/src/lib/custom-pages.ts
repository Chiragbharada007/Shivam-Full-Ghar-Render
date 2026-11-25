import { gatewayFetch } from "@/lib/gateway";

export interface LocalizedPageText {
  gu: string;
  hi: string;
  en: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: LocalizedPageText;
  content: LocalizedPageText;
  summary?: LocalizedPageText;
  coverImage?: string;
  showInMenu: boolean;
  showInFooter: boolean;
  seoTitle?: LocalizedPageText;
  seoDescription?: LocalizedPageText;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomPageInput {
  id?: string;
  slug: string;
  title: LocalizedPageText;
  content: LocalizedPageText;
  summary?: LocalizedPageText;
  coverImage?: string;
  showInMenu?: boolean;
  showInFooter?: boolean;
  seoTitle?: LocalizedPageText;
  seoDescription?: LocalizedPageText;
  isActive?: boolean;
  sortOrder?: number;
}

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: "page-flower-care",
    slug: "flower-care",
    title: {
      gu: "તાજા ફૂલો અને વરમાળાની સંભાળ માર્ગદર્શિકા",
      hi: "ताजे फूलों और वरमाला की देखभाल गाइड",
      en: "Fresh Wedding Flower & Varmala Care Guide",
    },
    content: {
      gu: "તાજા ફૂલોને ઠંડી જગ્યાએ રાખો અને સીધા સૂર્યપ્રકાશથી બચાવો.",
      hi: "ताजे फूलों को ठंडी जगह पर रखें और सीधी धूप से बचाएं।",
      en: "Keep fresh garlands in a cool, shaded place and lightly mist with clean water before ceremony.",
    },
    showInMenu: false,
    showInFooter: true,
    isActive: true,
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getAllActiveCustomPages(): Promise<CustomPage[]> {
  const res = await gatewayFetch<{ success: boolean; pages: any[] }>("/api/pages?locale=en");
  if (!res?.success || !res.pages?.length) {
    return DEFAULT_CUSTOM_PAGES;
  }
  return res.pages.map((p: any, idx: number) => ({
    id: p.id,
    slug: p.slug,
    title: { gu: p.title, hi: p.title, en: p.title },
    content: { gu: p.body, hi: p.body, en: p.body },
    showInMenu: false,
    showInFooter: true,
    isActive: true,
    sortOrder: idx,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export async function getCustomPageBySlug(slug: string): Promise<CustomPage | null> {
  const res = await gatewayFetch<{ success: boolean; page: any }>(`/api/pages?slug=${encodeURIComponent(slug)}&locale=en`);
  if (res?.success && res.page) {
    const p = res.page;
    return {
      id: p.id,
      slug: p.slug,
      title: { gu: p.title, hi: p.title, en: p.title },
      content: { gu: p.body, hi: p.body, en: p.body },
      showInMenu: false,
      showInFooter: true,
      isActive: true,
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return DEFAULT_CUSTOM_PAGES.find((p) => p.slug === slug) || null;
}
