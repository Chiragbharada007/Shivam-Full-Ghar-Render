import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getStorefrontProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";
import { getLiveBanners } from "@/lib/banners";
import { getStorefrontCategories } from "@/lib/categories";
import { HomeBannerSlider } from "@/components/site/HomeBannerSlider";
import { getPriceDisplay } from "@/lib/utils";
import { VideoCardGrid } from "@/components/site/VideoCardGrid";
import { DesignExperienceSection } from "@/components/site/DesignExperienceSection";
import { Interactive3DCard } from "@/components/site/Interactive3DCard";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
} from "lucide-react";
import { LocalBusinessJsonLd, FaqJsonLd } from "@/components/shared/JsonLd";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const settings = await getSiteSettings();

  const currentLocale = (locale || "gu") as "gu" | "hi" | "en";

  // Dynamically fetch all products from live PostgreSQL catalogue
  const catalogItems = await getStorefrontProducts({ locale });
  const liveBanners = await getLiveBanners();
  const dynamicCategories = await getStorefrontCategories();

  // Dynamic Home CMS values (P8-T20)
  const heroBadge =
    (currentLocale === "gu"
      ? settings.heroBadgeGu
      : currentLocale === "hi"
      ? settings.heroBadgeHi
      : settings.heroBadgeEn) || t("badge");

  const heroTitle =
    (currentLocale === "gu"
      ? settings.heroTitleGu
      : currentLocale === "hi"
      ? settings.heroTitleHi
      : settings.heroTitleEn) || t("heroTitle");

  const heroSubtitle =
    (currentLocale === "gu"
      ? settings.heroSubtitleGu
      : currentLocale === "hi"
      ? settings.heroSubtitleHi
      : settings.heroSubtitleEn) || t("heroSubtitle");

  const heroBtnPrimary =
    (currentLocale === "gu"
      ? settings.heroBtnPrimaryGu
      : currentLocale === "hi"
      ? settings.heroBtnPrimaryHi
      : settings.heroBtnPrimaryEn) || t("shopNow");

  const heroBtnSecondary =
    (currentLocale === "gu"
      ? settings.heroBtnSecondaryGu
      : currentLocale === "hi"
      ? settings.heroBtnSecondaryHi
      : settings.heroBtnSecondaryEn) || t("customDesignBtn");

  const heroSignatureImg = settings.heroSignatureImage || "/products/hero-wedding.jpg";
  const heroSignatureTitle =
    (currentLocale === "gu"
      ? settings.heroSignatureTitleGu
      : currentLocale === "hi"
      ? settings.heroSignatureTitleHi
      : settings.heroSignatureTitleEn) || "Royal Gujarati Varmala";

  const trust1 =
    (currentLocale === "gu" ? settings.trust1Gu : currentLocale === "hi" ? settings.trust1Hi : settings.trust1En) ||
    "100% Fresh Morning Flowers";

  const trust2 =
    (currentLocale === "gu" ? settings.trust2Gu : currentLocale === "hi" ? settings.trust2Hi : settings.trust2En) ||
    "Free Store Pickup at Bhat Simroli Shop";

  const trust3 =
    (currentLocale === "gu" ? settings.trust3Gu : currentLocale === "hi" ? settings.trust3Hi : settings.trust3En) ||
    "Boutique Quality Guarantee · Photo Preview on WhatsApp";

  const videoGridTitle =
    (currentLocale === "gu"
      ? settings.videoGridTitleGu
      : currentLocale === "hi"
      ? settings.videoGridTitleHi
      : settings.videoGridTitleEn) ||
    (currentLocale === "gu"
      ? "ઇમર્સિવ વેડિંગ ફ્લોરલ કલેક્શન"
      : currentLocale === "hi"
      ? "इमर्सिव विवाह पुष्प संग्रह"
      : "Immersive Wedding Floral Designs");

  const videoGridSubtitle =
    (currentLocale === "gu"
      ? settings.videoGridSubtitleGu
      : currentLocale === "hi"
      ? settings.videoGridSubtitleHi
      : settings.videoGridSubtitleEn) ||
    (currentLocale === "gu"
      ? "સવારે તાજા ચૂંટેલા ગુલાબ, મોગરા અને ઓર્કિડ્સમાંથી હાથથી ગૂંથેલી વિશેષ વરમાળા"
      : "Handcrafted with morning-plucked roses, Madurai mogra, and imported orchids in Bhat Simroli");

  const packagesBadge =
    (currentLocale === "gu"
      ? settings.packagesBadgeGu
      : currentLocale === "hi"
      ? settings.packagesBadgeHi
      : settings.packagesBadgeEn) || "Complete Wedding Arrangements";

  const packagesTitle =
    (currentLocale === "gu"
      ? settings.packagesTitleGu
      : currentLocale === "hi"
      ? settings.packagesTitleHi
      : settings.packagesTitleEn) || t("packagesTitle");

  const packagesSubtitle =
    (currentLocale === "gu"
      ? settings.packagesSubtitleGu
      : currentLocale === "hi"
      ? settings.packagesSubtitleHi
      : settings.packagesSubtitleEn) || t("packagesSubtitle");

  // Map to video card format for 4-column responsive grid
  const videoCards = catalogItems.slice(0, 12).map((p, idx) => ({
    code: p.code,
    name: p.name[currentLocale] || p.name.en,
    price: p.price,
    mrp: p.mrp || Math.round(p.price * 1.25),
    categoryName: p.categoryName[currentLocale] || p.categoryName.en,
    rating: p.rating || 4.9,
    reviewsCount: p.reviewsCount || 24,
    image: p.image || "/products/VM-R01.jpg",
    tag: idx === 0 ? "Best Seller" : idx === 1 ? "Traditional" : idx === 2 ? "Pure Mogra" : "Handcrafted",
    isNew: idx < 4,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-white transition-colors duration-300 selection:bg-brand-primary/30 selection:text-white">
      {/* ─── Structured Data (Schema.org JSON-LD P8-T41) ─── */}
      <LocalBusinessJsonLd locale={locale} />
      <FaqJsonLd locale={locale} />

      {/* ─── Dynamic Promotional Home Banners Slider (P8-T17) ─── */}
      <HomeBannerSlider banners={liveBanners} locale={locale} />

      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-brand bg-gradient-to-b from-brand-surface via-[var(--background)] to-[var(--background)]">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-brand-surface blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand text-brand-primary text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                <span>{heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-brand-deep leading-[1.12]">
                {heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#282A26]/80 max-w-xl font-sans leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href={`/${locale}/shop`}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-brand font-semibold text-sm flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{heroBtnPrimary}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${locale}/custom-design`}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-brand-surface text-brand-deep font-semibold text-sm border border-brand transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{heroBtnSecondary}</span>
                </Link>
              </div>

              {/* Micro Trust Bar */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#282A26]/75 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{trust1}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{trust2}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{trust3}</span>
                </span>
              </div>
            </div>

            {/* Right Column: Interactive 3D Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <Interactive3DCard>
                <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-brand bg-white group">
                  <div className="aspect-4/5 relative overflow-hidden">
                    <img
                      src={heroSignatureImg}
                      alt={heroSignatureTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold block">
                          Signature Collection
                        </span>
                        <h3 className="font-serif font-bold text-brand-deep text-sm">
                          {heroSignatureTitle}
                        </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-xs font-bold shadow-xs">
                      {getPriceDisplay(3200, Boolean(settings.showPrices), currentLocale)}
                    </span>
                  </div>
                </div>
              </div>
              </Interactive3DCard>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive 3D Showcase, 6-Theme Switcher & Scroll Zoom Stage ─── */}
      <DesignExperienceSection locale={locale} products={catalogItems} />

      {/* ─── Category Quick Nav Row (Dynamic from PostgreSQL - P8-T18) ─────── */}
      <section className="py-12 border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#080808] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {dynamicCategories.map((cat) => {
              const catTitle = cat.name[currentLocale] || cat.name.en || cat.name.gu;
              const catDesc = cat.description[currentLocale] || cat.description.en || cat.description.gu;
              return (
                <Link
                  key={cat.slug}
                  href={`/${locale}/shop?category=${cat.slug}`}
                  className="group p-3 sm:p-4 rounded-2xl bg-stone-50 dark:bg-[#0d0d0d] border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/25 transition-all flex items-center gap-3.5 hover:scale-[1.02] shadow-xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 relative bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10">
                    <img
                      src={cat.coverImage}
                      alt={catTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-serif font-bold text-zinc-900 dark:text-white text-xs sm:text-sm group-hover:text-brand-primary dark:group-hover:text-rose-300 transition-colors truncate">
                      {catTitle}
                    </h4>
                    {catDesc && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-sans">
                        {catDesc}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Parts 4, 5, 6, 7, 8: 4-Column Template Card Grid with Looping Video Previews ─── */}
      <VideoCardGrid
        products={videoCards}
        locale={locale}
        showPrices={settings.showPrices}
        sectionTitle={videoGridTitle}
        sectionSubtitle={videoGridSubtitle}
        viewAllLink="/shop"
        viewAllText={locale === "gu" ? "બધી ડિઝાઇન →" : "All Templates →"}
      />

      {/* ─── Packages Preview (Luxury Aesthetic) ──────────────────── */}
      <section className="py-16 sm:py-20 bg-[#f4f3ef] dark:bg-[#080808] border-b border-black/10 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-brand-primary">
              {packagesBadge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white">
              {packagesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{packagesSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: locale === "gu" ? "વરરાજા-કન્યા આવશ્યક પેકેજ" : "Bride & Groom Essentials",
                price: 5900,
                desc: "Varmala Pair + 2 Classic Mogra Gajras",
                badge: "Most Popular",
                image: "/products/package-wedding.jpg",
              },
              {
                title: locale === "gu" ? "કાર + વરમાળા કૉમ્બો" : "Car + Varmala Combo",
                price: 7900,
                desc: "Royal Varmala Pair + Full Car Rose Decoration",
                badge: "Great Value",
                image: "/products/CR-02.jpg",
              },
              {
                title: locale === "gu" ? "સંપૂર્ણ લગ્ન ફૂલ પેકેજ" : "Complete Wedding Flower Package",
                price: 24999,
                desc: "Varmala, Car, Veni, Gajra, Mandap entrance set",
                badge: "Luxury All-in-One",
                image: "/products/FJ-01.jpg",
              },
            ].map((pkg, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 overflow-hidden flex flex-col justify-between hover:border-black/20 dark:hover:border-white/25 hover:scale-[1.01] transition-all shadow-md hover:shadow-xl dark:shadow-none dark:hover:shadow-xl group"
              >
                <div className="aspect-16/9 relative overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black text-xs font-bold shadow-md">
                    {pkg.badge}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      {pkg.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase font-mono">Package Total</span>
                      <span className={`font-bold ${settings.showPrices ? "text-xl sm:text-2xl font-serif text-zinc-900 dark:text-white" : "text-xs font-medium text-brand-primary dark:text-brand-primary font-sans"}`}>
                        {getPriceDisplay(pkg.price, Boolean(settings.showPrices), currentLocale)}
                      </span>
                    </div>

                    <Link
                      href={`/${locale}/packages`}
                      className="px-4 py-2 rounded-full bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs transition-colors"
                    >
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works (Glass Cards) ───────────────────────────────── */}
      <section className="py-16 bg-[#faf9f6] dark:bg-[#060606] border-b border-black/10 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-white">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: t("step1Title"),
                desc: t("step1Desc"),
                icon: "💐",
              },
              {
                step: "02",
                title: t("step2Title"),
                desc: t("step2Desc"),
                icon: "📅",
              },
              {
                step: "03",
                title: t("step3Title"),
                desc: t("step3Desc"),
                icon: "✂️",
              },
              {
                step: "04",
                title: t("step4Title"),
                desc: t("step4Desc"),
                icon: "📍",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="relative p-6 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{st.icon}</span>
                  <span className="font-serif font-black text-2xl text-black/15 dark:text-white/20">
                    {st.step}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-zinc-900 dark:text-white text-base">
                  {st.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Stats ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-[#080808] border-b border-black/10 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <span className="font-serif font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white block">
                {t("trustStat1")}
              </span>
              <span className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1 block">
                {t("trustLabel1")}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <span className="font-serif font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white block">
                {t("trustStat2")}
              </span>
              <span className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1 block">
                {t("trustLabel2")}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <span className="font-serif font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white block">
                {t("trustStat3")}
              </span>
              <span className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1 block">
                {t("trustLabel3")}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <span className="font-serif font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white block">
                {t("trustStat4")}
              </span>
              <span className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1 block">
                {t("trustLabel4")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Customer Reviews ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#faf9f6] dark:bg-[#060606] border-b border-black/10 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-white">
              {t("reviewsTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Riya Patel",
                village: "Bhat Simroli",
                text: "The royal red varmala was exceptionally fresh! The fragrance lasted throughout the reception. Everyone complimented the floral craftsmanship.",
                stars: 5,
              },
              {
                name: "Prakash Vala",
                village: "Mangrol",
                text: "Car rose decoration was executed with meticulous detail. They arrived right on time at our venue. Highly recommended!",
                stars: 5,
              },
              {
                name: "Meera Dave",
                village: "Agatrai",
                text: "The bridal hair veni was so delicate and fragrant. The 40% advance system with tracking gave us total peace of mind.",
                stars: 5,
              },
            ].map((rev, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex text-amber-500 dark:text-amber-400 gap-0.5">
                    {Array.from({ length: rev.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic font-sans">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-white">{rev.name}</span>
                  <span className="text-zinc-500">{rev.village}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-[#080808] transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-white">
              {t("faqTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">{t("faqSubtitle")}</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the difference between Varmala and Jaimala?",
                a: "Both refer to the sacred wedding garland exchanged by the bride and groom during Hindu matrimony. In Gujarat and Saurashtra, it is traditionally called 'Varmala' (વરમાળા).",
              },
              {
                q: "How early should I book flowers for my wedding?",
                a: "For signature garlands and wedding orders, we recommend booking at least 2–3 days in advance. For custom Pinterest reference designs or full-car arrangements, 4–5 days advance notice allows us to procure exotic morning blooms.",
              },
              {
                q: "Where can I pick up my floral order?",
                a: "You can pick up directly from our flagship shop in Bhat Simroli free of charge, freshly prepared on the morning of your event.",
              },
              {
                q: "How does the 40% advance payment work?",
                a: "To confirm fresh flower procurement, an advance of 40% is logged. The remaining 60% balance is payable when flowers are picked up at our Bhat Simroli shop.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl bg-stone-50 dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-5 transition-all"
              >
                <summary className="font-serif font-semibold text-zinc-900 dark:text-white cursor-pointer list-none flex items-center justify-between gap-3 text-sm sm:text-base">
                  <span>{faq.q}</span>
                  <span className="text-brand-primary dark:text-brand-primary font-bold transition-transform group-open:rotate-45 text-lg">
                    +
                  </span>
                </summary>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-3 pt-3 border-t border-black/10 dark:border-white/10 leading-relaxed font-sans">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
