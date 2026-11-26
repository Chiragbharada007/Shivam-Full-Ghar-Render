import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { formatPrice, getPriceDisplay } from "@/lib/utils";
import { getSiteSettings } from "@/lib/site-settings";
import { Sparkles, Check, ArrowRight, Zap, ShieldCheck, MessageCircle } from "lucide-react";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  const packages = [
    {
      slug: "bride-groom-essentials",
      image: "/products/hero-wedding.jpg",
      name:
        locale === "gu"
          ? "વરરાજા-કન્યા આવશ્યક પેકેજ"
          : locale === "hi"
          ? "दूल्हा-दुल्हन आवश्यक पैकेज"
          : "Bride & Groom Essentials",
      price: 5900,
      mrp: 7200,
      description:
        "The quintessential wedding ceremony package: matching bride and groom royal varmala pair with fresh mogra fragrance gajras.",
      features: [
        "1x Matching Royal Rose & Jasmine Varmala Pair (4 ft)",
        "2x Classic Mogra Gajra Pair for Bridal Bun",
        "Free Gift Packaging & Flower Preservation Spray",
        "Boutique Studio Pickup with Freshness Lock Guarantee",
      ],
      popular: true,
    },
    {
      slug: "car-varmala-combo",
      image: "/products/CR-02.jpg",
      name:
        locale === "gu"
          ? "કાર + વરમાળા કૉમ્બો"
          : locale === "hi"
          ? "कार + वरमाला कॉम्बो"
          : "Car + Varmala Combo",
      price: 7900,
      mrp: 9600,
      description:
        "Grand celebration combo including couple wedding varmala along with complete luxury car front-bonnet and door handle floral decoration.",
      features: [
        "1x Premium Rose & Orchid Varmala Pair (4.5 ft)",
        "1x Full Front Bonnet Fresh Rose & Floral Arrangement",
        "4x Door Handle Matching Garland Accents",
        "On-Site Car Decorator Assistance in Bhat Simroli",
      ],
      popular: false,
    },
    {
      slug: "complete-wedding-package",
      image: "/products/package-wedding.jpg",
      name:
        locale === "gu"
          ? "સંપૂર્ણ લગ્ન ફૂલ પેકેજ"
          : locale === "hi"
          ? "संपूर्ण विवाह फूल पैकेज"
          : "Complete Wedding Flower Package",
      price: 24999,
      mrp: 29999,
      description:
        "End-to-end royal wedding floral coverage from pre-wedding haldi/mehndi jewellery to mandap floral entryway and couple varmala.",
      features: [
        "1x 5 ft Grand Rose & Exotic Orchid Royal Varmala Pair",
        "1x Complete Bridal Floral Jewellery Set (Necklace, Haath-phool, Earrings)",
        "2x Bridal Fresh Rose Veni for Hair Braid",
        "1x Full Luxury Car Decoration",
        "4x Mogra Gajra Pairs for Family & Bridesmaids",
        "Priority VIP Morning Handover Guarantee",
      ],
      popular: false,
    },
  ];

  return (
    <div className="py-14 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-brand-primary dark:text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>All-In-One Curated Floral Combos</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-zinc-900 dark:text-white">
            {locale === "gu" ? "વિશેષ લગ્ન પેકેજ" : "Wedding Floral Packages"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Thoughtfully planned bundles to save time and expense while guaranteeing perfectly coordinated flowers for your grand day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.slug}
              className={`rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative group ${
                pkg.popular
                  ? "bg-white dark:bg-[#0c0c0c] border-2 border-brand shadow-xl ring-4 ring-rose-500/10"
                  : "bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-lg"
              }`}
            >
              {/* Photo Banner */}
              <div className="relative aspect-16/9 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {pkg.popular && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-primary text-white font-bold text-[10px] shadow-md uppercase tracking-wide">
                    ★ Most Popular
                  </span>
                )}
              </div>

              <div className="p-6 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed font-sans">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-mono uppercase">
                      Package Deal
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className={`font-bold ${settings.showPrices ? "text-3xl font-serif text-zinc-900 dark:text-white" : "text-sm font-medium text-emerald-600 dark:text-emerald-400 font-sans"}`}>
                        {getPriceDisplay(pkg.price, Boolean(settings.showPrices), (locale as any) || "gu")}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-1">
                      {locale === "gu" ? "તાજા ઓર્ડર મુજબ બનાવેલ પેકેજ" : "Handcrafted full wedding set"}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-2.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">
                      What's Included:
                    </span>
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-black/10 dark:border-white/10">
                  <a
                    href={`https://wa.me/919824132014?text=${encodeURIComponent(
                      `Hello Shivam Full Ghar Bhat Simroli, I want to enquire about the ${pkg.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>
                      {locale === "gu"
                        ? "વોટ્સએપ પર પેકેજ બુક કરો"
                        : locale === "hi"
                        ? "व्हाट्सएप पर पैकेज बुक करें"
                        : "Enquire Package on WhatsApp"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
