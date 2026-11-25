// src/lib/search.ts
// Multilingual, phonetic and transliteration search engine for Shivam Full Ghar
// Supports Gujarati, Hindi, English, and Romanized spellings (e.g. varmala, jaimala, veni, mogra, gajra)

import { CATALOG_PRODUCTS, ProductCatalogItem } from "@/lib/catalog";
import { getStorefrontProducts } from "@/lib/products";

export interface SearchResultItem {
  id: string;
  type: "product" | "category" | "page";
  title: string;
  subtitle?: string;
  categoryName?: string;
  badge?: string;
  image?: string;
  url: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  products: SearchResultItem[];
  categories: SearchResultItem[];
  pages: SearchResultItem[];
  total: number;
}

// Synonyms and transliterations mapping
const SYNONYM_GROUPS: string[][] = [
  // Varmala / Garlands
  ["varmala", "var mala", "jaimala", "jai mala", "garland", "garlands", "વરમાળા", "વરમાળ", "वरमाला", "जयमाला", "લગ્ન વરમાળા", "विवाह वरमाला"],
  // Rose / Gulab
  ["rose", "roses", "gulab", "red", "lal", "pink", "ગુલાબ", "લાલ", "गुलाब", "लाल", "ગુલાબી"],
  // Bridal Hair Veni
  ["veni", "veny", "hair flowers", "bridal veni", "choti", "hair", "વેણી", "બ્રાઈડલ વેણી", "वेणी", "ब्राइडल वेणी", "जूड़ा फूल"],
  // Mogra / Gajra
  ["mogra", "gajra", "gazra", "jasmine", "madurai", "chameli", "મોગરા", "ગજરા", "મદુરાઈ મોગરા", "मोगरा", "गजरा", "मदुरै"],
  // Car Decoration
  ["car", "car decor", "car decoration", "gaadi", "gadi", "wedding car", "doli", "કાર", "ગાડી", "કાર સજાવટ", "गाड़ी", "कार सजावट"],
  // Floral Jewellery
  ["jewellery", "jewelry", "haldi", "gehna", "gharena", "ornaments", "floral jewellery", "ઘરેણાં", "હળદર", "ફૂલોના ઘરેણાં", "गहने", "हल्दी", "फूलों के गहने"],
  // Wedding Packages
  ["package", "packages", "wedding package", "combo", "lagna package", "પેકેજ", "લગ્ન પેકેજ", "पैकेज", "विवाह पैकेज", "कॉम्बो"],
  // Custom Design
  ["custom", "custom design", "builder", "bespoke", "personalized", "કસ્ટમ", "કસ્ટમ ડિઝાઇન", "ઓર્ડર", "कस्टम", "कस्टम डिज़ाइन"],
  // Gallery
  ["gallery", "photo", "photos", "pictures", "real photos", "ગેલેરી", "ફોટો", "ગેલરી", "गैलरी", "तस्वीरें", "तस्वीर"],
  // About / Boutique Shop / Address
  ["about", "about us", "shop", "store", "address", "location", "keshod", "bhat", "simroli", "boutique", "અમારા વિશે", "દુકાન", "સરનામું", "કેશોદ", "ભાટ", "સિમરોલી", "हमारे बारे में", "दुकान", "पता"],
  // Contact / WhatsApp
  ["contact", "contact us", "phone", "whatsapp", "call", "number", "reach", "સંપર્ક", "ફોન", "વોટ્સએપ", "संपर्क", "फोन", "व्हाट्सएप", "९૮૨૪૧૩૨૦૧૪", "9824132014"],
  // Orchid
  ["orchid", "orchids", "purple", "ઓર્કિડ", "ऑर्किड"],
  // Marigold
  ["marigold", "genda", "yellow", "ગલગોટો", "गेंदा", "પીળો", "पीला"],
];

function normalize(text: string): string {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Expands search query tokens using the synonym dictionary
function expandQueryTokens(query: string): string[] {
  const normQuery = normalize(query);
  if (!normQuery) return [];

  const rawTokens = normQuery.split(" ").filter((t) => t.length > 0);
  const tokenSet = new Set<string>(rawTokens);
  tokenSet.add(normQuery);

  for (const group of SYNONYM_GROUPS) {
    const groupMatches = group.some((term) => {
      const normTerm = normalize(term);
      return (
        normQuery.includes(normTerm) ||
        normTerm.includes(normQuery) ||
        rawTokens.some((t) => normTerm.split(" ").includes(t))
      );
    });

    if (groupMatches) {
      for (const term of group) {
        tokenSet.add(normalize(term));
      }
    }
  }

  return Array.from(tokenSet);
}

// Calculates relevance score for target string against expanded tokens
function calculateMatchScore(target: string, query: string, expandedTokens: string[]): number {
  if (!target) return 0;
  const normTarget = normalize(target);
  const normQuery = normalize(query);

  let score = 0;

  // Exact full query match
  if (normTarget === normQuery) {
    score += 100;
  } else if (normTarget.startsWith(normQuery)) {
    score += 70;
  } else if (normTarget.includes(normQuery)) {
    score += 50;
  }

  // Token matches
  for (const token of expandedTokens) {
    if (!token) continue;
    if (token.length < 2) continue;

    if (normTarget === token) {
      score += 40;
    } else if (normTarget.startsWith(token)) {
      score += 25;
    } else if (normTarget.includes(token)) {
      score += 15;
    }
  }

  return score;
}

export interface SearchCategoryMeta {
  id: string;
  slug: string;
  name: { gu: string; hi: string; en: string };
  description: { gu: string; hi: string; en: string };
  image: string;
  keywords: string[];
}

export const SEARCH_CATEGORIES: SearchCategoryMeta[] = [
  {
    id: "garlands",
    slug: "garlands",
    name: { gu: "લગ્ન વરમાળા", hi: "विवाह वरमाला", en: "Wedding Garlands" },
    description: {
      gu: "તાજા લાલ ગુલાબ અને ઓર્કિડ વરમાળા સેટ",
      hi: "ताजे लाल गुलाब और ऑर्किड वरमाला सेट",
      en: "Handcrafted fresh royal rose & orchid varmalas",
    },
    image: "/products/VM-R01.jpg",
    keywords: ["varmala", "jaimala", "garlands", "rose garland", "wedding garland", "વરમાળા", "वरमाला", "જયમાલા", "હસ્તમેળાપ"],
  },
  {
    id: "car-decoration",
    slug: "car-decoration",
    name: { gu: "કાર સજાવટ", hi: "कार सजावट", en: "Car Decoration" },
    description: {
      gu: "લક્ઝરી લગ્ન કાર અને ડોલી ડેકોરેશન",
      hi: "लक्ज़री विवाह कार और डोली सजावट",
      en: "Luxury wedding car bonnet & ribbon floral decor",
    },
    image: "/products/CR-01.jpg",
    keywords: ["car", "gaadi", "car decor", "decoration", "કાર", "ગાડી", "સજાવટ", "गाड़ी", "कार डेकोर"],
  },
  {
    id: "hair-flowers",
    slug: "hair-flowers",
    name: { gu: "બ્રાઈડલ વેણી", hi: "ब्राइडल वेणी", en: "Bridal Hair Veni" },
    description: {
      gu: "દુલ્હન માટે તાજા મોગરા અને ગુલાબ વેણી",
      hi: "दुल्हन के लिए ताजी मोगरा और गुलाब वेणी",
      en: "Bridal jasmine, rose petal and gypsophila venis",
    },
    image: "/products/HF-01.jpg",
    keywords: ["veni", "bridal veni", "hair flowers", "choti", "વેણી", "બ્રાઈડલ વેણી", "वेणी", "ચોટી"],
  },
  {
    id: "gajra",
    slug: "gajra",
    name: { gu: "મદુરાઈ મોગરા ગજરા", hi: "मदुरै गजरा", en: "Mogra Gajra" },
    description: {
      gu: "સુગંધિત મદુરાઈ મોગરા અને ચમેલી ગજરા",
      hi: "सुगंधित मदुरै मोगरा और चमेली गजरा",
      en: "Fragrant Madurai mogra jasmine gajras",
    },
    image: "/products/GJ-01.jpg",
    keywords: ["gajra", "mogra", "jasmine", "madurai", "ગજરા", "મોગરા", "गजरा", "मोगरा"],
  },
  {
    id: "floral-jewellery",
    slug: "floral-jewellery",
    name: { gu: "ફૂલોના ઘરેણાં", hi: "फूलों के गहने", en: "Floral Jewellery" },
    description: {
      gu: "હળદર અને મહેંદી માટે તાજા ફૂલોના દાગીના",
      hi: "हल्दी और मेहंदी के लिए ताजे फूलों के आभूषण",
      en: "Handcrafted fresh flower jewellery for Haldi & Mehndi",
    },
    image: "/products/FJ-01.jpg",
    keywords: ["jewellery", "jewelry", "haldi", "gehna", "gharena", "દાગીના", "ઘરેણાં", "હળદર", "ગહેને", "हल्दी"],
  },
];

export interface SearchPageMeta {
  id: string;
  path: string;
  title: { gu: string; hi: string; en: string };
  description: { gu: string; hi: string; en: string };
  badge?: string;
  keywords: string[];
}

export const SEARCH_PAGES: SearchPageMeta[] = [
  {
    id: "home",
    path: "",
    title: { gu: "મુખ્ય પૃષ્ઠ (હોમ)", hi: "मुख्य पृष्ठ (होम)", en: "Home" },
    description: {
      gu: "શિવમ ફૂલ ઘર ભાટ સિમરોલી - તાજા ફૂલો અને વરમાળા",
      hi: "शिवम फूल घर भाट सिमरौली - ताजे फूल और वरमाला",
      en: "Shivam Full Ghar Bhat Simroli - Fresh Flowers & Varmala",
    },
    keywords: ["home", "start", "shivam", "bhat", "simroli", "હોમ", "શિવમ", "ભાટ સિમરોલી", "होम", "शिवम"],
  },
  {
    id: "shop",
    path: "/shop",
    title: { gu: "કલેક્શન અને શોપ", hi: "कलेक्शन और शॉप", en: "Collections & Store" },
    description: {
      gu: "તમામ તાજા ફૂલો, વરમાળા અને ડેકોરેશનનું કલેક્શન",
      hi: "सभी ताजे फूल, वरमाला और सजावट का कलेक्शन",
      en: "Browse all fresh wedding flowers, garlands and decor",
    },
    keywords: ["shop", "store", "collections", "products", "items", "બધા ફૂલ", "કલેક્શન", "દુકાન", "कलेक्शन", "स्टोर"],
  },
  {
    id: "packages",
    path: "/packages",
    title: { gu: "લગ્ન પેકેજ", hi: "विवाह पैकेज", en: "Wedding Packages" },
    description: {
      gu: "સંપૂર્ણ લગ્ન ફ્લોરલ કોમ્બો પેકેજ (વરમાળા, કાર, વેણી, ગજરા)",
      hi: "सम्पूर्ण विवाह फ्लोरल कॉम्बो पैकेज (वरमाला, कार, वेणी, गजरा)",
      en: "Complete bespoke wedding floral combo packages",
    },
    badge: "Combo",
    keywords: ["package", "packages", "wedding package", "combo", "budget", "લગ્ન પેકેજ", "પેકેજ", "કોમ્બો", "पैकेज", "कॉम्बो"],
  },
  {
    id: "custom-design",
    path: "/custom-design",
    title: { gu: "કસ્ટમ ડિઝાઇન અને ઓર્ડર", hi: "कस्टम डिज़ाइन और ऑर्डर", en: "Custom Garland Builder" },
    description: {
      gu: "તમારી પસંદગી મુજબના ફૂલો અને રંગની વરમાળા બનાવો",
      hi: "अपनी पसंद के फूलों और रंगों की वरमाला तैयार करवाएं",
      en: "Build your own custom wedding garland & request quote",
    },
    badge: "Interactive",
    keywords: ["custom", "custom design", "builder", "bespoke", "કસ્ટમ", "ડિઝાઇન", "ઓર્ડર", "कस्टम", "डिज़ाइन"],
  },
  {
    id: "gallery",
    path: "/gallery",
    title: { gu: "વાસ્તવિક ફોટો ગેલેરી", hi: "असली फोटो गैलरी", en: "Real Photo Gallery" },
    description: {
      gu: "સૌરાષ્ટ્રના લગ્નોમાં અમારા બનાવેલા ફૂલોના અસલી ફોટા",
      hi: "सौराष्ट्र के विवाहों में हमारे तैयार किए गए फूलों की असली तस्वीरें",
      en: "High-resolution client photos of our floral designs",
    },
    badge: "Photos",
    keywords: ["gallery", "photo", "photos", "real photos", "pictures", "ગેલેરી", "ફોટો", "ગેલરી", "गैलरी", "तस्वीरें"],
  },
  {
    id: "about",
    path: "/about",
    title: { gu: "અમારા વિશે અને દુકાનનું સરનામું", hi: "हमारे बारे में और दुकान का पता", en: "About Us & Store Location" },
    description: {
      gu: "ભાટ સિમરોલી, કેશોદ, જૂનાગઢ - સવારે ૫:૦૦ થી રાત્રે ૯:૩૦",
      hi: "भाट सिमरौली, केशोद, जूनागढ़ - सुबह ५:०० से रात ९:३०",
      en: "Bhat Simroli, Keshod, Junagadh - Fresh flowers daily since 2012",
    },
    badge: "Boutique",
    keywords: ["about", "story", "store", "address", "location", "keshod", "bhat", "simroli", "અમારા વિશે", "સરનામું", "દુકાન", "કેશોદ", "पता", "दुकान"],
  },
  {
    id: "contact",
    path: "/contact",
    title: { gu: "સંપર્ક અને વોટ્સએપ", hi: "संपर्क और व्हाट्सएप", en: "Contact & Direct WhatsApp" },
    description: {
      gu: "મોબાઇલ / વોટ્સએપ: ૯૮૨૪૧૩૨૦૧૪ - તાત્કાલિક જવાબ મેળવો",
      hi: "मोबाइल / व्हाट्सएप: ९८२४१३२०१४ - तुरंत उत्तर प्राप्त करें",
      en: "Direct WhatsApp & Phone: 9824132014 - Instant replies",
    },
    badge: "WhatsApp",
    keywords: ["contact", "phone", "whatsapp", "call", "mobile", "help", "support", "સંપર્ક", "ફોન", "વોટ્સએપ", "संपर्क", "फोन"],
  },
];

export async function searchStorefront(
  query: string,
  locale: "gu" | "hi" | "en" = "gu"
): Promise<SearchResponse> {
  const cleanQuery = (query || "").trim();
  if (!cleanQuery) {
    return { query: "", products: [], categories: [], pages: [], total: 0 };
  }

  const expandedTokens = expandQueryTokens(cleanQuery);

  // 1. Match Categories
  const matchedCategories: SearchResultItem[] = [];
  for (const cat of SEARCH_CATEGORIES) {
    let score = 0;
    const catName = cat.name[locale] || cat.name.en;
    const catDesc = cat.description[locale] || cat.description.en;

    score += calculateMatchScore(cat.slug, cleanQuery, expandedTokens) * 1.5;
    score += calculateMatchScore(catName, cleanQuery, expandedTokens) * 2;
    score += calculateMatchScore(cat.name.en, cleanQuery, expandedTokens);
    score += calculateMatchScore(cat.name.gu, cleanQuery, expandedTokens);
    score += calculateMatchScore(cat.name.hi, cleanQuery, expandedTokens);
    score += calculateMatchScore(catDesc, cleanQuery, expandedTokens) * 0.5;

    for (const kw of cat.keywords) {
      score += calculateMatchScore(kw, cleanQuery, expandedTokens) * 1.2;
    }

    if (score > 15) {
      matchedCategories.push({
        id: cat.id,
        type: "category",
        title: catName,
        subtitle: catDesc,
        badge: locale === "gu" ? "કેટેગરી" : locale === "hi" ? "श्रेणी" : "Category",
        image: cat.image,
        url: `/${locale}/shop?category=${cat.slug}`,
        score,
      });
    }
  }

  // 2. Match Pages
  const matchedPages: SearchResultItem[] = [];
  for (const page of SEARCH_PAGES) {
    let score = 0;
    const pageTitle = page.title[locale] || page.title.en;
    const pageDesc = page.description[locale] || page.description.en;

    score += calculateMatchScore(page.id, cleanQuery, expandedTokens);
    score += calculateMatchScore(pageTitle, cleanQuery, expandedTokens) * 2;
    score += calculateMatchScore(page.title.en, cleanQuery, expandedTokens);
    score += calculateMatchScore(page.title.gu, cleanQuery, expandedTokens);
    score += calculateMatchScore(page.title.hi, cleanQuery, expandedTokens);
    score += calculateMatchScore(pageDesc, cleanQuery, expandedTokens) * 0.5;

    for (const kw of page.keywords) {
      score += calculateMatchScore(kw, cleanQuery, expandedTokens) * 1.2;
    }

    if (score > 15) {
      matchedPages.push({
        id: page.id,
        type: "page",
        title: pageTitle,
        subtitle: pageDesc,
        badge: page.badge || (locale === "gu" ? "પેજ" : locale === "hi" ? "पेज" : "Page"),
        url: `/${locale}${page.path}`,
        score,
      });
    }
  }

  // 3. Match Products
  let productList: ProductCatalogItem[] = [];
  try {
    productList = await getStorefrontProducts({ locale });
  } catch {
    productList = CATALOG_PRODUCTS;
  }
  if (!productList || productList.length === 0) {
    productList = CATALOG_PRODUCTS;
  }

  const matchedProducts: SearchResultItem[] = [];
  for (const p of productList) {
    let score = 0;

    // Exact code match (e.g. VM-R01) gets massive boost
    if (p.code.toLowerCase() === cleanQuery.toLowerCase()) {
      score += 200;
    } else if (p.code.toLowerCase().includes(cleanQuery.toLowerCase())) {
      score += 80;
    }

    const pName = p.name[locale] || p.name.en;
    const pDesc = p.description[locale] || p.description.en;
    const pFlowers = p.flowersUsed?.[locale] || p.flowersUsed?.en || "";
    const pCatName = p.categoryName?.[locale] || p.categoryName?.en || "";

    score += calculateMatchScore(pName, cleanQuery, expandedTokens) * 2;
    score += calculateMatchScore(p.name.en, cleanQuery, expandedTokens) * 1.5;
    score += calculateMatchScore(p.name.gu, cleanQuery, expandedTokens) * 1.5;
    score += calculateMatchScore(p.name.hi, cleanQuery, expandedTokens) * 1.5;
    score += calculateMatchScore(p.category, cleanQuery, expandedTokens) * 1.2;
    score += calculateMatchScore(pCatName, cleanQuery, expandedTokens) * 1.2;
    score += calculateMatchScore(pFlowers, cleanQuery, expandedTokens) * 0.8;
    score += calculateMatchScore(pDesc, cleanQuery, expandedTokens) * 0.4;

    if (score > 15) {
      matchedProducts.push({
        id: p.id,
        type: "product",
        title: pName,
        subtitle: `${p.code} • ${pCatName}`,
        categoryName: pCatName,
        badge: p.code,
        image: p.image,
        url: `/${locale}/shop/${p.id}`,
        score,
      });
    }
  }

  // Sort by score descending
  matchedCategories.sort((a, b) => b.score - a.score);
  matchedPages.sort((a, b) => b.score - a.score);
  matchedProducts.sort((a, b) => b.score - a.score);

  return {
    query: cleanQuery,
    products: matchedProducts.slice(0, 10),
    categories: matchedCategories.slice(0, 5),
    pages: matchedPages.slice(0, 4),
    total: matchedProducts.length + matchedCategories.length + matchedPages.length,
  };
}
