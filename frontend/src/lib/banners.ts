import { gatewayFetch } from "@/lib/gateway";

export interface LocalizedString {
  gu: string;
  hi: string;
  en: string;
  [key: string]: string | undefined;
}

export interface HomeBanner {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  badge?: LocalizedString;
  ctaText?: LocalizedString;
  linkUrl: string;
  desktopImage: string;
  mobileImage: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HomeBannerInput {
  id?: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  badge?: LocalizedString;
  ctaText?: LocalizedString;
  linkUrl: string;
  desktopImage: string;
  mobileImage: string;
  isActive: boolean;
  sortOrder?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export const DEFAULT_BANNERS: HomeBanner[] = [
  {
    id: "banner-wedding-season-2026",
    title: {
      gu: "રોયલ વેડિંગ વરમાળા કલેક્શન ૨૦૨૬",
      hi: "रॉयल वेडिंग वरमाला कलेक्शन २०२६",
      en: "Royal Wedding Varmala Collection 2026",
    },
    subtitle: {
      gu: "સવારે ૫:૦૦ વાગ્યે ચૂંટેલા તાજા ડચ ગુલાબ, ઓર્કિડ અને મોગરાની હાથબનાવટ વરમાળા",
      hi: "सुबह ५:०० बजे चुने ताजे डच गुलाब, ऑर्किड और मोगरा की दस्तकारी वरमाला",
      en: "Handcrafted fresh Dutch rose, exotic orchid & pure jasmine garlands for grand weddings",
    },
    linkUrl: "/shop",
    desktopImage: "/products/hero-wedding.jpg",
    mobileImage: "/products/hero-wedding.jpg",
    isActive: true,
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getLiveBanners(): Promise<HomeBanner[]> {
  const res = await gatewayFetch<{ success: boolean; banners: any[] }>("/api/banners?locale=en");
  if (!res?.success || !res.banners?.length) {
    return DEFAULT_BANNERS;
  }

  return res.banners.map((b: any) => ({
    id: b.id,
    title: { gu: b.title || "", hi: b.title || "", en: b.title || "" },
    subtitle: { gu: b.subtitle || "", hi: b.subtitle || "", en: b.subtitle || "" },
    linkUrl: b.linkUrl || "/shop",
    desktopImage: b.imageUrl || "/products/hero-wedding.jpg",
    mobileImage: b.imageUrl || "/products/hero-wedding.jpg",
    isActive: true,
    sortOrder: b.sortOrder || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}
