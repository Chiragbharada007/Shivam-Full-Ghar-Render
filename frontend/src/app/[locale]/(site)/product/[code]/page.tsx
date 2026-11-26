import { notFound } from "next/navigation";
import { ProductView } from "@/components/site/ProductView";
import { getEarliestDeliveryDate } from "@/lib/delivery";
import { formatIST } from "@/lib/utils";
import { getProductByCode } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const currentLocale = (locale || "gu") as "gu" | "hi" | "en";

  const settings = await getSiteSettings();
  const matched = await getProductByCode(code);

  if (!matched) {
    notFound();
  }

  const currentProduct = {
    id: matched.id,
    code: matched.code,
    name: matched.name[currentLocale] || matched.name.en,
    description: matched.description[currentLocale] || matched.description.en,
    basePrice: matched.price,
    prepTimeDays: matched.prepDays,
    categoryName: matched.categoryName[currentLocale] || matched.categoryName.en,
    image: matched.image,
    options: matched.options || [
      { id: "opt-1", label: "3.5 ft (Standard)", priceAdd: 0 },
      { id: "opt-2", label: "4.5 ft (Grand Royal)", priceAdd: 500 },
    ],
    addOns: matched.addOns || [
      { id: "addon-1", label: "Aromatic Mogra Spray & Flower Preservation", price: 100 },
    ],
  };

  const earliestDateObj = getEarliestDeliveryDate(currentProduct.prepTimeDays);
  const earliestDate = formatIST(earliestDateObj).split(",")[0];

  // JSON-LD structured data for Google SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: currentProduct.name,
    image: `https://shivam-full-ghar.vercel.app${matched.image}`,
    description: currentProduct.description,
    sku: currentProduct.code,
    offers: {
      "@type": "Offer",
      url: `https://shivam-full-ghar.vercel.app/${locale}/product/${currentProduct.code}`,
      availability: "https://schema.org/InStock",
      ...(settings.showPrices
        ? {
            priceCurrency: "INR",
            price: currentProduct.basePrice,
          }
        : {}),
    },
  };

  return (
    <div className="py-8 sm:py-12 px-3 sm:px-6 bg-transparent text-zinc-900 min-h-screen transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 rounded-3xl bg-white/88 backdrop-blur-md border border-white/25 shadow-2xl">
        <ProductView
          product={currentProduct}
          earliestDate={earliestDate}
          showPrices={settings.showPrices}
        />
      </div>
    </div>
  );
}
