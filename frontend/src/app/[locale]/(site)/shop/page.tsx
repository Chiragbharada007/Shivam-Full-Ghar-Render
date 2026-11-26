import { getTranslations } from "next-intl/server";
import { getStorefrontProducts } from "@/lib/products";
import { getStorefrontCategories } from "@/lib/categories";
import { getSiteSettings } from "@/lib/site-settings";
import { ShopProductGrid } from "@/components/site/ShopProductGrid";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    colour?: string;
    sort?: string;
    search?: string;
    q?: string;
  }>;
}) {
  const { locale } = await params;
  const { category, colour, sort, search, q } = await searchParams;
  const initialSearch = search || q || "";
  const settings = await getSiteSettings();

  // Dynamically load from PostgreSQL store catalog with rich fallback
  const products = await getStorefrontProducts({ locale, category, colour, sort });
  const categories = await getStorefrontCategories();

  return (
    <div className="py-12 bg-[#FAF7EF] text-[#282A26] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#244C38]/10 border border-[#244C38]/20 text-[#244C38] text-xs font-semibold uppercase tracking-wider">
            <span>
              {locale === "gu"
                ? "ભાટ સિમરોલી અને સૌરાષ્ટ્રના લગ્નો માટે વિશેષ"
                : "Handcrafted Wedding Florals in Saurashtra"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#163526] tracking-tight">
            {locale === "gu"
              ? "તાજા ફૂલો અને લગ્ન વરમાળા"
              : locale === "hi"
              ? "ताजे फूल और विवाह वरमाला"
              : "Fresh Flowers & Wedding Garlands"}
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto font-sans">
            {locale === "gu"
              ? "શિવમ ફૂલ ઘર ભાટ સિમરોલી તરફથી રોયલ વરમાળા, કાર સજાવટ, બ્રાઈડલ વેણી, મદુરાઈ મોગરા ગજરા અને ફૂલોના ઘરેણાં — સવારે ૫:૦૦ વાગ્યે ચૂંટેલા તાજા ફૂલો સાથે."
              : "Authentic royal varmalas, bridal hair venis, fresh Madurai mogra gajras, wedding car bouquets and ceremonial floral jewellery hand-strung with pure morning blossoms in Bhat Simroli."}
          </p>
        </div>

        {/* Interactive Shop Grid with Filters, Bubble Slider & Direct Buy */}
        <ShopProductGrid
          products={products}
          categories={categories}
          initialCategory={category}
          initialColour={colour}
          initialSort={sort}
          initialSearch={initialSearch}
          showPrices={settings.showPrices}
        />
      </div>
    </div>
  );
}
