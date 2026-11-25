import Link from "next/link";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const articles = [
    {
      slug: "how-to-choose-varmala-colours",
      title:
        locale === "gu"
          ? "વરમાળા રંગ કેવી રીતે પસંદ કરવા — રંગ અને થીમ માર્ગદર્શિકા"
          : "How to Choose Varmala Colours for Your Wedding Outfits",
      excerpt:
        "From royal red roses matching deep maroon lehengas to soft pastel pinks complementing contemporary ivory sherwanis, discover how to pair garland flowers with your wedding attire.",
      date: "10 Nov 2026",
      readTime: "4 min read",
      emoji: "🌸",
    },
    {
      slug: "wedding-flower-checklist",
      title:
        locale === "gu"
          ? "લગ્ન ફૂલ ચેકલિસ્ટ — મંડપથી લઈને કાર ડેકોરેશન સુધી"
          : "The Ultimate Wedding Flower Checklist for Gujarati Families",
      excerpt:
        "Ensure no floral detail is overlooked: varmalas, gajras for bridesmaids, hair venis, mehndi floral jewellery, car bonnet decor, and entrance floral swags.",
      date: "05 Nov 2026",
      readTime: "6 min read",
      emoji: "📋",
    },
    {
      slug: "navratri-flower-guide",
      title:
        locale === "gu"
          ? "નવરાત્રિ અને દિવાળી પૂજા ફૂલ માર્ગદર્શિકા"
          : "Fresh Flower Arrangements for Auspicious Festivals & Pujas",
      excerpt:
        "Learn which marigolds, lotus blossoms and jasmine flowers carry special significance for temple rituals and festive garba night adornments.",
      date: "28 Oct 2026",
      readTime: "3 min read",
      emoji: "🪔",
    },
  ];

  return (
    <div className="py-14 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Floral Insights & Wedding Inspiration
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-zinc-900 dark:text-white">
            Wedding Flower Journal & Tips
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Expert floristry advice from the craftsmen at Shivam Full Ghar in Bhat Simroli, Gujarat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.slug}
              className="rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-5xl">
                {art.emoji}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/10 dark:border-white/10">
                  <span className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                    Read Full Guide <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
