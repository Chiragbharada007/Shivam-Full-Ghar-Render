"use client";

import React from "react";
import Link from "next/link";
import { Flower2, Car, Gem, Sparkles, ArrowRight, MessageCircle, MapPin } from "lucide-react";
import { PerfectCard } from "@/components/ui/PerfectCard";
import { HaleShowcase } from "@/components/site/HaleShowcase";
import { CountUpNumber, BlurInReveal } from "@/components/shared/ScrollEffects";
import { FloralDivider, LotusCrest } from "@/components/graphics/FloralGraphics";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function DesignExperienceSection({
  locale,
  products,
}: {
  locale: string;
  products: any[];
}) {
  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Trust Metrics (Responds to Whole Green / Whole Red Theme) */}
      <section className="rounded-3xl p-8 md:p-10 bg-brand-deep text-[#FAF7EF] border border-[#D7B77C]/30 shadow-sm transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <CountUpNumber target={1250} suffix="+" className="text-3xl sm:text-4xl font-serif font-bold text-[#D7B77C] block" />
            <span className="text-xs text-[#FAF7EF]/80 mt-1 block">Weddings Adorned</span>
          </div>
          <div>
            <CountUpNumber target={48} className="text-3xl sm:text-4xl font-serif font-bold text-[#D7B77C] block" />
            <span className="text-xs text-[#FAF7EF]/80 mt-1 block">Fresh Floral Varieties</span>
          </div>
          <div>
            <CountUpNumber target={100} suffix="%" className="text-3xl sm:text-4xl font-serif font-bold text-[#D7B77C] block" />
            <span className="text-xs text-[#FAF7EF]/80 mt-1 block">Morning Farm Harvest</span>
          </div>
          <div>
            <CountUpNumber target={35} suffix="+" className="text-3xl sm:text-4xl font-serif font-bold text-[#D7B77C] block" />
            <span className="text-xs text-[#FAF7EF]/80 mt-1 block">Saurashtra Villages Served</span>
          </div>
        </div>
      </section>

      {/* 2. Interactive 3D Floral Showcase + Colour-World Switcher */}
      <div className="space-y-4">
        <HaleShowcase />
        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          <span className="text-xs font-semibold text-brand-deep">
            Switch Floral Colour World:
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* 2b. Scroll Story: From Garden to Garland */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <LotusCrest className="w-9 h-9 mx-auto" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block">
            Craftsmanship Story
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-deep">
            From Keshod Garden to Wedding Garland
          </h2>
          <FloralDivider />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { step: "01", title: "5:00 AM Harvest", desc: "Fresh Dutch roses, lotus & Madurai mogra picked at dawn." },
            { step: "02", title: "Petal Selection", desc: "Hand-sorted for fragrance, colour vibrancy & softness." },
            { step: "03", title: "Artisan Threading", desc: "Woven by master florists in Bhat Simroli to your length." },
            { step: "04", title: "Morning Dispatch", desc: "Mist-hydrated & ready for Keshod store pickup on time." },
          ].map((item, idx) => (
            <BlurInReveal key={item.step} delay={idx * 0.08}>
              <div className="h-full p-6 rounded-3xl bg-white border border-brand shadow-xs space-y-2">
                <span className="font-mono-tech text-xs font-bold text-brand-primary">
                  STEP {item.step}
                </span>
                <h3 className="font-serif text-xl font-bold text-brand-deep">{item.title}</h3>
                <p className="text-xs text-[#282A26]/75 leading-relaxed">{item.desc}</p>
              </div>
            </BlurInReveal>
          ))}
        </div>
      </section>

      {/* 3. Best-Selling Wedding Designs */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9F333E]">
              Best Sellers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#163526] mt-1">
              Handcrafted Floral Favorites
            </h2>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244C38] hover:text-[#9F333E] transition-colors"
          >
            <span>Explore Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(products || []).slice(0, 6).map((p: any) => (
            <PerfectCard
              key={p.id || p.code}
              image={p.image || "/products/VM-R01.jpg"}
              title={p.name?.[locale] || p.name?.en || p.code}
              details={p.description?.[locale] || p.description?.en || "Fresh morning-plucked wedding flowers."}
              priceBadge={`₹${(p.price || 1500).toLocaleString("en-IN")}`}
              actionLabel="View & Order"
              href={`/${locale}/product/${p.code}`}
            />
          ))}
        </div>
      </section>

      {/* 4. Car Decoration & Floral Jewellery Highlight */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white border border-[#244C38]/15 shadow-xs flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#244C38]/10 text-[#244C38] flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#163526]">
              Wedding Car Decoration
            </h3>
            <p className="text-xs text-[#282A26]/75 leading-relaxed">
              Fresh Dutch rose bonnet arrangements, orchid side-mirror ribbons, and heritage baraat car canopies styled at our Bhat Simroli workshop.
            </p>
          </div>
          <Link
            href={`/${locale}/shop?category=car-decoration`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9F333E] hover:underline"
          >
            <span>Browse Car Decor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#244C38]/15 shadow-xs flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#9F333E]/10 text-[#9F333E] flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#163526]">
              Bridal Floral Jewellery & Veni
            </h3>
            <p className="text-xs text-[#282A26]/75 leading-relaxed">
              7-piece Haldi & Mehndi floral jewellery sets, Madurai mogra gajras, and fresh braided rose venis handcrafted for comfort and fragrance.
            </p>
          </div>
          <Link
            href={`/${locale}/shop?category=floral-jewellery`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#244C38] hover:underline"
          >
            <span>Browse Bridal Sets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. WhatsApp & Store Visit CTA */}
      <section className="rounded-3xl p-8 md:p-10 bg-brand-primary text-[#FAF7EF] flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#D7B77C]">
            <Sparkles className="w-3.5 h-3.5" /> Direct Florist Assistance
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#FAF7EF]">
            Need a Custom Wedding Flower Quote?
          </h3>
          <p className="text-xs text-[#FAF7EF]/80 leading-relaxed">
            Share your wedding date, garland colour theme, or reference photo for fast pricing and guaranteed morning pickup in Bhat Simroli, Keshod.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href={`/${locale}/custom-design`}
            className="px-5 py-3 rounded-xl bg-[#FAF7EF] text-[#163526] font-semibold text-xs hover:bg-[#D7B77C] transition-colors inline-flex items-center gap-2"
          >
            <Flower2 className="w-4 h-4 text-[#9F333E]" />
            <span>Custom Flower Inquiry</span>
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="px-5 py-3 rounded-xl border border-[#D7B77C]/50 text-[#FAF7EF] font-semibold text-xs hover:bg-[#163526] transition-colors inline-flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#D7B77C]" />
            <span>Visit Shop</span>
          </Link>
          <a
            href="https://wa.me/919824132014"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#9F333E] text-[#FAF7EF] font-semibold text-xs hover:opacity-95 transition-opacity inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
