import { Sparkles, Heart, ShieldCheck, MapPin, Phone, Clock } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="py-14 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-brand-primary">
            About Shivam Full Ghar
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-zinc-900 dark:text-white">
            Devotion in Every Petal
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Crafting memorable wedding floral traditions in Bhat Simroli, Saurashtra, Gujarat.
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-8 sm:p-10 shadow-sm space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans transition-colors">
          <h2 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white">
            Our Story & Heritage
          </h2>
          <p>
            Welcome to <strong>Shivam Full Ghar (શિવમ ફૂલ ઘર)</strong>, located in Bhat Simroli, Gujarat. For over a decade, we have been blessed to be part of thousands of wedding ceremonies, festive pujas, and family milestones across Junagadh district.
          </p>
          <p>
            In Gujarati tradition, the wedding garland (વરમાળા) is not merely a floral ornament — it symbolizes the eternal union and mutual respect of two souls and their families. That is why we procure only prime morning blossoms — fragrant red roses from Rajkot & Pune, authentic mogra and champa, and exotic orchids.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/10 dark:border-white/10">
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Morning Harvest</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Fresh blossoms plucked at dawn for longest fragrance and vibrant hue.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1.5">
              <Heart className="w-5 h-5 text-brand-primary" />
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Artisan Strung</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Hand-woven using time-honoured techniques for balanced weight and comfort.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Punctual Handover</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Ready at our Bhat Simroli boutique with fresh flower preservation guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* Shop details card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-colors">
          <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 font-sans">
            <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
              Visit Our Flagship Florist Shop
            </h3>
            <p>Shivam Full Ghar, Bhat Simroli, Gujarat 362220</p>
            <p>Hours: Everyday 8:00 AM – 8:00 PM • Phone: +91 98241 32014</p>
          </div>
        </div>
      </div>
    </div>
  );
}
