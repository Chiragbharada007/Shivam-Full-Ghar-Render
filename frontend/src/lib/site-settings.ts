import { gatewayFetch } from "@/lib/gateway";

export interface SiteSettingsData {
  shopName: string;
  shopNameGu: string;
  shopNameHi: string;
  shopTagline: string;
  logoUrl: string;
  contactPhone: string;
  whatsappNumber: string;
  showPrices: boolean;
  showWhatsAppLink: boolean;
  email: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  googleMapsUrl: string;
  advancePct: number;
  freeDeliveryThreshold: number;
  dailyCapacity: number;
  minPrepDays: number;
  announcementGu: string;
  announcementHi: string;
  announcementEn: string;

  heroBadgeGu: string;
  heroBadgeHi: string;
  heroBadgeEn: string;
  heroTitleGu: string;
  heroTitleHi: string;
  heroTitleEn: string;
  heroSubtitleGu: string;
  heroSubtitleHi: string;
  heroSubtitleEn: string;
  heroBtnPrimaryGu: string;
  heroBtnPrimaryHi: string;
  heroBtnPrimaryEn: string;
  heroBtnSecondaryGu: string;
  heroBtnSecondaryHi: string;
  heroBtnSecondaryEn: string;
  heroSignatureImage: string;
  heroSignatureTitleGu: string;
  heroSignatureTitleHi: string;
  heroSignatureTitleEn: string;

  trust1Gu: string;
  trust1Hi: string;
  trust1En: string;
  trust2Gu: string;
  trust2Hi: string;
  trust2En: string;
  trust3Gu: string;
  trust3Hi: string;
  trust3En: string;

  videoGridTitleGu: string;
  videoGridTitleHi: string;
  videoGridTitleEn: string;
  videoGridSubtitleGu: string;
  videoGridSubtitleHi: string;
  videoGridSubtitleEn: string;

  packagesBadgeGu: string;
  packagesBadgeHi: string;
  packagesBadgeEn: string;
  packagesTitleGu: string;
  packagesTitleHi: string;
  packagesTitleEn: string;
  packagesSubtitleGu: string;
  packagesSubtitleHi: string;
  packagesSubtitleEn: string;

  footerAboutGu: string;
  footerAboutHi: string;
  footerAboutEn: string;
  footerCopyrightGu: string;
  footerCopyrightHi: string;
  footerCopyrightEn: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  shopName: "Shivam Full Ghar",
  shopNameGu: "શિવમ ફૂલ ઘર",
  shopNameHi: "शिवम फूल घर",
  shopTagline: "Fresh Wedding Garlands & Sacred Blossom Boutique • Bhat Simroli",
  logoUrl: "/icon.svg",
  contactPhone: "+91 97372 96595",
  whatsappNumber: "+91 98241 32014",
  showPrices: false,
  showWhatsAppLink: true,
  email: "shivamfullghar@gmail.com",
  address: "Shivam Full Ghar, Bhat Simroli, Gujarat 362220",
  openingHours: "8:00 AM – 8:00 PM Everyday",
  instagramUrl: "https://instagram.com/shivam_ful_ghar",
  facebookUrl: "https://facebook.com/shivam_ful_ghar",
  youtubeUrl: "https://youtube.com/@shivam_ful_ghar",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=21.2270972,70.1808229",
  advancePct: 40,
  freeDeliveryThreshold: 3000,
  dailyCapacity: 10,
  minPrepDays: 2,
  announcementGu: "દુકાનેથી તાજા ફૂલોનું મફત પિકઅપ! કોડ WELCOME10 થી 10% છૂટ.",
  announcementHi: "दुकान से ताजे फूलों का मुफ्त पिकअप! कोड WELCOME10 से 10% छूट।",
  announcementEn: "Free store pickup from our Bhat Simroli shop! Use code WELCOME10 for 10% off.",

  heroBadgeGu: "શિવમ ફૂલ ઘર • ભાટ સિમરોલી",
  heroBadgeHi: "शिवम फूल घर • भाट सिमरौली",
  heroBadgeEn: "Shivam Full Ghar • Bhat Simroli",
  heroTitleGu: "પવિત્ર લગ્ન વરમાળા અને તાજા ફૂલોનો ભંડાર",
  heroTitleHi: "पवित्र विवाह वरमाला और ताजे फूलों का भंडार",
  heroTitleEn: "Sacred Wedding Garlands & Fresh Blossom Boutique",
  heroSubtitleGu: "ખાસ કરીને સૌરાષ્ટ્રના લગ્નોત્સવ માટે પ્રીમિયમ તાજા ગુલાબ, મોગરા અને ઓર્કિડ્સની હાથવણાટ વરમાળા, દુલ્હન વેણી અને કાર શણગાર.",
  heroSubtitleHi: "विशेष रूप से सौराष्ट्र के विवाह समारोहों के लिए ताजे गुलाब, मोगरा और आर्किड की हस्तनिर्मित वरमाला, दुल्हन वेणी और कार सजावट।",
  heroSubtitleEn: "Bespoke handcrafted wedding garlands, bridal veni, car floral decor and sacred puja blooms freshly styled in Bhat Simroli.",
  heroBtnPrimaryGu: "બધા ફૂલો જુઓ",
  heroBtnPrimaryHi: "सभी फूल देखें",
  heroBtnPrimaryEn: "Explore Catalogue",
  heroBtnSecondaryGu: "કસ્ટમ વરમાળા ઓર્ડર",
  heroBtnSecondaryHi: "कस्टम वरमाला ऑर्डर",
  heroBtnSecondaryEn: "Custom Garland Order",
  heroSignatureImage: "/products/hero-wedding.jpg",
  heroSignatureTitleGu: "રોયલ ગુજરાતી વરમાળા",
  heroSignatureTitleHi: "रॉयल गुजराती वरमाला",
  heroSignatureTitleEn: "Royal Gujarati Varmala",

  trust1Gu: "૧૦૦% તાજા સવારના ફૂલો",
  trust1Hi: "100% ताजे सुबह के फूल",
  trust1En: "100% Fresh Morning Flowers",
  trust2Gu: "ભાટ સિમરોલી દુકાનેથી મફત પિકઅપ",
  trust2Hi: "भाट सिमरौली दुकान से मुफ्त पिकअप",
  trust2En: "Free Store Pickup at Bhat Simroli Shop",
  trust3Gu: "વ્હોટ્સએપ પર ફોટો પ્રીવ્યૂની ગેરંટી",
  trust3Hi: "व्हाट्सएप पर फोटो पूर्वावलोकन गारंटी",
  trust3En: "Boutique Quality Guarantee · Photo Preview on WhatsApp",

  videoGridTitleGu: "ઇમર્સિવ વેડિંગ ફ્લોરલ કલેક્શન",
  videoGridTitleHi: "इमर्सिव विवाह पुष्प संग्रह",
  videoGridTitleEn: "Immersive Wedding Floral Designs",
  videoGridSubtitleGu: "સવારે તાજા ચૂંટેલા ગુલાબ, મોગરા અને ઓર્કિડ્સમાંથી હાથથી ગૂંથેલી વિશેષ વરમાળા",
  videoGridSubtitleHi: "सुबह के ताजे गुलाब, मदुरै मोगरा और आर्किड से हस्तनिर्मित विशेष वरमाला",
  videoGridSubtitleEn: "Handcrafted with morning-plucked roses, Madurai mogra, and imported orchids in Bhat Simroli",

  packagesBadgeGu: "સંપૂર્ણ લગ્ન આયોજન",
  packagesBadgeHi: "संपूर्ण विवाह व्यवस्था",
  packagesBadgeEn: "Complete Wedding Arrangements",
  packagesTitleGu: "લગ્ન ફૂલ પેકેજ",
  packagesTitleHi: "विवाह पुष्प पैकेज",
  packagesTitleEn: "Curated Wedding Flower Packages",
  packagesSubtitleGu: "વરમાળા, ગાડી શણગાર, વેણી અને મંડપના સેટ એક જ સાથે સ્પેશિયલ ઑફરમાં",
  packagesSubtitleHi: "वरमाला, कार सजावट, वेणी और मंडप सेट एक साथ विशेष पेशकश में",
  packagesSubtitleEn: "All-in-one coordinated floral arrangements for weddings, receptions, and traditional celebrations",

  footerAboutGu: "ભાટ સિમરોલી, સૌરાષ્ટ્રમાં તાજા લગ્ન વરમાળા, દુલ્હન હેર વેણી, ગજરા, કાર ડેકોરેશન અને ઓરિજિનલ ફ્લોરલ જ્વેલરીનું વિશ્વસનીય સ્થાન.",
  footerAboutHi: "भाट सिमरौली, सौराष्ट्र में ताजी विवाह वरमाला, दुल्हन हेयर वेणी, गजरा, कार सजावट और प्रामाणिक फ्लोरल ज्वेलरी का विश्वसनीय स्थान।",
  footerAboutEn: "Premium fresh wedding garlands (વરમાળા), bridal hair veni, gajra, car bouquet decoration and authentic floral jewellery in Bhat Simroli, Saurashtra, Gujarat.",
  footerCopyrightGu: "© 2026 શિવમ ફૂલ ઘર. સર્વાધિકાર સુરક્ષિત. ભાટ સિમરોલીમાં શ્રદ્ધાપૂર્વક નિર્મિત.",
  footerCopyrightHi: "© 2026 शिवम फूल घर। सर्वाधिकार सुरक्षित। भाट सिमरौली में श्रद्धापूर्वक निर्मित।",
  footerCopyrightEn: "© 2026 Shivam Full Ghar. All rights reserved. Handcrafted with devotion in Bhat Simroli.",
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const res = await gatewayFetch<{ success: boolean; settings: Record<string, string> }>("/api/site-settings");
  if (!res?.success || !res.settings) {
    return { ...DEFAULT_SITE_SETTINGS };
  }

  const resolved: any = { ...DEFAULT_SITE_SETTINGS };
  for (const [key, defVal] of Object.entries(DEFAULT_SITE_SETTINGS)) {
    const raw = res.settings[key];
    if (raw !== undefined && raw !== "") {
      if (typeof defVal === "boolean") resolved[key] = raw === "true";
      else if (typeof defVal === "number") {
        const parsed = parseInt(raw, 10);
        resolved[key] = isNaN(parsed) ? defVal : parsed;
      } else {
        resolved[key] = raw;
      }
    }
  }
  return resolved;
}
