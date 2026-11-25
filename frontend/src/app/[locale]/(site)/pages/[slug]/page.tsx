import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getCustomPageBySlug } from "@/lib/custom-pages";
import { getSiteSettings } from "@/lib/site-settings";
import { ChevronRight, MessageCircle, ArrowLeft, Calendar, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

interface DynamicPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = (locale === "hi" || locale === "en" ? locale : "gu") as "gu" | "hi" | "en";
  const page = await getCustomPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | Shivam Full Ghar",
    };
  }

  const title =
    page.seoTitle?.[currentLocale] ||
    page.title[currentLocale] ||
    page.title.gu;
  const description =
    page.seoDescription?.[currentLocale] ||
    page.summary?.[currentLocale] ||
    page.title[currentLocale];

  return {
    title: `${title} | Shivam Full Ghar Bhat Simroli`,
    description,
    alternates: {
      canonical: `/${locale}/pages/${slug}`,
    },
  };
}

export default async function DynamicCustomPage({ params }: DynamicPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locale === "hi" || locale === "en" ? locale : "gu") as "gu" | "hi" | "en";
  const page = await getCustomPageBySlug(slug);

  if (!page || !page.isActive) {
    notFound();
  }

  const settings = await getSiteSettings();
  const title = page.title[currentLocale] || page.title.en || page.title.gu;
  const summary = page.summary?.[currentLocale] || page.summary?.en || page.summary?.gu;
  const content = page.content[currentLocale] || page.content.en || page.content.gu;

  // Split content into paragraphs for clean rendering
  const paragraphs = content.split("\n\n").filter(Boolean);

  const rawDigits = settings.whatsappNumber.replace(/\D/g, "") || "9824132014";
  const phoneDigits = rawDigits.startsWith("91") && rawDigits.length === 12 ? rawDigits : `91${rawDigits.slice(-10)}`;

  return (
    <div className="py-10 sm:py-16 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-black dark:hover:text-white transition-colors">
            {currentLocale === "gu" ? "હોમ" : currentLocale === "hi" ? "होम" : "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/${locale}/shop`} className="hover:text-black dark:hover:text-white transition-colors">
            {currentLocale === "gu" ? "કલેક્શન" : "Store"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{title}</span>
        </nav>

        {/* Back Link */}
        <div>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentLocale === "gu" ? "પાછા જાઓ" : "Back to Home"}</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="space-y-4 border-b border-black/10 dark:border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20 text-xs font-bold tracking-wide">
            <FileText className="w-3.5 h-3.5" />
            <span>Shivam Full Ghar • Bhat Simroli</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            {title}
          </h1>

          {summary && (
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed">
              {summary}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {new Date(page.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>

        {/* Optional Cover Banner Photo */}
        {page.coverImage && (
          <div className="relative w-full h-56 sm:h-72 md:h-96 rounded-3xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 border border-black/10 dark:border-white/15 shadow-xl">
            <Image
              src={page.coverImage}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 896px) 896px, 100vw"
            />
          </div>
        )}

        {/* Formatted Content Body */}
        <article className="prose prose-zinc dark:prose-invert max-w-none space-y-5 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 font-sans">
          {paragraphs.map((p, idx) => {
            const trimmed = p.trim();
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-white pt-4">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("#### ")) {
              return (
                <h4 key={idx} className="text-base sm:text-lg font-serif font-bold text-zinc-900 dark:text-white pt-2">
                  {trimmed.replace("#### ", "")}
                </h4>
              );
            }
            return (
              <p key={idx} className="whitespace-pre-line">
                {trimmed}
              </p>
            );
          })}
        </article>

        {/* Direct Contact & WhatsApp Help Box */}
        <div className="rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 transition-colors">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
              {currentLocale === "gu"
                ? "કોઈ પ્રશ્ન કે વિશેષ ઓર્ડરની જરૂર છે?"
                : currentLocale === "hi"
                ? "कोई प्रश्न या विशेष ऑर्डर की आवश्यकता है?"
                : "Have any questions or need custom arrangements?"}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {currentLocale === "gu"
                ? "અમારા ભાટ સિમરોલી સ્ટોર પર વોટ્સએપ દ્વારા સીધો સંપર્ક કરો."
                : "Reach our Bhat Simroli floral boutique directly on WhatsApp."}
            </p>
          </div>

          <a
            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(
              `Hello Shivam Full Ghar, I am inquiring about "${title}".`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              {currentLocale === "gu" ? "વોટ્સએપ પર પૂછો" : "Chat on WhatsApp"}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
