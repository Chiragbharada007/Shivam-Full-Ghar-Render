"use client";

import React, { useState } from "react";
import { Sparkles, Bell, Layers } from "lucide-react";
import {
  ZoomOutReveal,
  BlurInReveal,
  SnapCarousel,
  StackingCard,
  TiltInCard,
  CountUpNumber,
  MaskRevealText,
} from "@/components/shared/ScrollEffects";
import { PerfectCard } from "@/components/ui/PerfectCard";
import { HaleShowcase } from "@/components/site/HaleShowcase";
import {
  FloatingLabelInput,
  SearchInput,
  TagsInput,
  DateMaskInput,
  StepperInput,
} from "@/components/ui/SmartInputs";
import {
  RangeHistogramSlider,
  ValueBubbleSlider,
  EmojiFeedbackSlider,
  RotaryKnobSlider,
  VerticalSlider,
  VideoScrubberSlider,
} from "@/components/ui/SmartSliders";
import { FeedUpdaterBar } from "@/components/shared/FeedUpdater";
import { PageTransitionWrapper, TransitionMode } from "@/components/shared/PageTransition";
import {
  LiveStatusPill,
  NotificationBadge,
  InlineAlert,
  useNotifications,
} from "@/components/shared/NotificationSystem";

export function DesignExperienceSection({
  locale,
  products,
}: {
  locale: string;
  products: any[];
}) {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 9000]);
  const [tags, setTags] = useState<string[]>(["Dutch Rose", "Madurai Mogra"]);
  const [eventDate, setEventDate] = useState("24/12/2026");
  const [customerName, setCustomerName] = useState("");
  const [qty, setQty] = useState(2);
  const [discountPct, setDiscountPct] = useState(40);
  const [rating, setRating] = useState(5);
  const [knobVal, setKnobVal] = useState(65);
  const [vertVal, setVertVal] = useState(80);
  const [frame, setFrame] = useState(2);
  const [transitionMode, setTransitionMode] = useState<TransitionMode>("circle-reveal");
  const [activeTab, setActiveTab] = useState("varmala");
  const [refreshing, setRefreshing] = useState(false);

  const { notify, openDialog, unreadCount, clearUnread } = useNotifications();

  const filtered = (products || []).filter((p) => {
    const name = p.name?.[locale] || p.name?.en || p.code || "";
    return !search || name.toLowerCase().includes(search.toLowerCase());
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      notify({
        title: "Catalog Refreshed",
        message: "Latest fresh morning bloom inventory synced.",
        variant: "success",
      });
    }, 650);
  };

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. Expressive Multi-Font Hero Stats & 8 Scroll Effects */}
      <ZoomOutReveal>
        <div className="rounded-[36px] p-8 md:p-10 glass-emerald text-white space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LiveStatusPill label="Keshod Fresh Morning Dispatch Active" />
            <button
              type="button"
              onClick={() => {
                clearUnread();
                notify({
                  title: "2026 Wedding Season Open",
                  message: "Free Keshod Store Pickup enabled on all orders.",
                  kind: "banner",
                });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-300" />
              <span>Alerts</span>
              <NotificationBadge count={unreadCount} />
            </button>
          </div>

          <MaskRevealText>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight">
              Crafted in <span className="font-editorial italic text-rose-300">Royal Blooms</span>,
              Engineered in Emerald & Crimson.
            </h2>
          </MaskRevealText>

          <BlurInReveal delay={0.1}>
            <p className="font-geometric text-sm text-emerald-100/85 max-w-2xl">
              Explore handcrafted varmalas, bridal car decor, and custom wedding garlands with real-time 3D preview and instant Keshod boutique pickup.
            </p>
          </BlurInReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {[
              { label: "Weddings Styled", val: 1250, suffix: "+" },
              { label: "Fresh Varieties", val: 48, suffix: "" },
              { label: "Morning Delivery", val: 100, suffix: "%" },
              { label: "Boutique Rating", val: 99, suffix: "%" },
            ].map((stat) => (
              <TiltInCard key={stat.label} className="p-5 rounded-3xl bg-white/5 border border-emerald-400/20">
                <CountUpNumber target={stat.val} suffix={stat.suffix} className="text-2xl sm:text-3xl font-bold text-emerald-300 block" />
                <span className="text-xs font-geometric text-zinc-300 mt-1 block">{stat.label}</span>
              </TiltInCard>
            ))}
          </div>
        </div>
      </ZoomOutReveal>

      {/* 2. HALE-Style 3D Interactive Floral Showcase */}
      <HaleShowcase />

      {/* 3. Feed Updater + 5-Rule Perfect Cards + Snap Carousel */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono-tech text-[11px] uppercase tracking-widest text-purple-500">
              Curated Collection
            </span>
            <h2 className="font-editorial text-3xl font-bold mt-1">
              Signature Wedding Designs
            </h2>
          </div>
          <div className="w-full sm:w-72">
            <SearchInput value={search} onChange={setSearch} />
          </div>
        </div>

        <FeedUpdaterBar
          onRefresh={handleRefresh}
          loading={refreshing}
          newItemsCount={2}
          onShowNew={handleRefresh}
        />

        <SnapCarousel>
          {(filtered.length ? filtered : []).slice(0, 6).map((p: any) => (
            <div key={p.id || p.code} className="min-w-[290px] sm:min-w-[320px] snap-start">
              <PerfectCard
                image={p.image || "/products/VM-R01.jpg"}
                title={p.name?.[locale] || p.name?.en || p.code}
                details={p.description?.[locale] || p.description?.en || "Fresh morning-plucked wedding flowers."}
                priceBadge={`₹${(p.price || 1500).toLocaleString("en-IN")}`}
                actionLabel="Customize & Order"
                href={`/${locale}/product/${p.code}`}
              />
            </div>
          ))}
        </SnapCarousel>
      </section>

      {/* 4. Page Transition Demo + Interactive Wedding Studio (8 Inputs + 8 Sliders) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Interactive Inputs & Sliders */}
        <div className="p-6 rounded-[32px] bg-white dark:bg-[#110d1b] border border-black/10 dark:border-purple-500/20 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>Custom Garland Studio</span>
            </h3>
            <StepperInput value={qty} onChange={setQty} label="Pairs" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatingLabelInput label="Bride / Groom Name" value={customerName} onChange={setCustomerName} />
            <DateMaskInput value={eventDate} onChange={setEventDate} />
          </div>

          <TagsInput tags={tags} onChange={setTags} />

          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Budget Range Filter (Histogram)</span>
            <RangeHistogramSlider value={priceRange} onChange={setPriceRange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2">
            <ValueBubbleSlider value={discountPct} onChange={setDiscountPct} unit="% Adv" />
            <RotaryKnobSlider value={knobVal} onChange={setKnobVal} label="Density" />
            <VerticalSlider value={vertVal} onChange={setVertVal} label="Scent" />
          </div>

          <VideoScrubberSlider frame={frame} onChange={setFrame} />
          <EmojiFeedbackSlider value={rating} onChange={setRating} />

          <button
            type="button"
            onClick={() =>
              openDialog({
                title: "Confirm Custom Quote Inquiry?",
                message: `Send inquiry for ${qty} pair(s) on ${eventDate} with tags: ${tags.join(", ")}?`,
                onConfirm: () =>
                  notify({
                    title: "Inquiry Prepared",
                    message: "Our Keshod master florist will confirm shortly.",
                    kind: "progress",
                    progress: 100,
                  }),
              })
            }
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-rose-600 text-white font-geometric font-bold text-xs shadow-lg"
          >
            Preview Inquiry Confirmation
          </button>
        </div>

        {/* Right: Stacking Cards + 8 Page Transitions Switcher */}
        <div className="space-y-4">
          <div className="p-6 rounded-[32px] bg-white dark:bg-[#071a13] border border-emerald-500/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-500" />
                <span>Screen Transitions</span>
              </h3>
              <select
                value={transitionMode}
                onChange={(e) => setTransitionMode(e.target.value as TransitionMode)}
                className="text-xs px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15"
              >
                <option value="circle-reveal">7. Circle Reveal</option>
                <option value="slide">1. Slide</option>
                <option value="fade">2. Fade</option>
                <option value="zoom">3. Zoom</option>
                <option value="shared">4. Shared Element</option>
                <option value="modal-sheet">5. Modal Sheet</option>
                <option value="flip">6. 3D Flip</option>
                <option value="card-stack">8. Card Stack</option>
              </select>
            </div>

            <div className="flex gap-2">
              {["varmala", "car", "mandap"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                    activeTab === tab ? "bg-emerald-600 text-white" : "bg-black/5 dark:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <PageTransitionWrapper mode={transitionMode} transitionKey={activeTab}>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/85 to-rose-950/75 border border-emerald-400/25 text-white space-y-2">
                <span className="font-mono-tech text-[11px] text-emerald-300 uppercase">{activeTab} highlight</span>
                <h4 className="font-editorial text-2xl font-bold">
                  {activeTab === "varmala"
                    ? "Hand-Tied Fresh Rose & Lotus Varmalas"
                    : activeTab === "car"
                    ? "Bespoke Bridal Sedan Floral Styling"
                    : "Grand Marigold & Jasmine Mandap Setups"}
                </h4>
                <p className="text-xs text-zinc-200">
                  Crafted at dawn in Bhat Simroli, Keshod for maximum fragrance and longevity.
                </p>
              </div>
            </PageTransitionWrapper>

            <InlineAlert
              title="Store Pickup Available"
              message="Zero delivery fee when picked up directly from our Bhat Simroli, Keshod boutique."
              variant="success"
            />
          </div>

          <StackingCard index={0} className="p-5 rounded-3xl glass-emerald text-white">
            <span className="font-mono-tech text-[10px] text-emerald-300">STEP 01 • 5:00 AM</span>
            <p className="font-display font-bold text-sm mt-1">Dawn Farm Harvest & Quality Sort</p>
          </StackingCard>
          <StackingCard index={1} className="p-5 rounded-3xl glass-royal-red text-zinc-900">
            <span className="font-mono-tech text-[10px] text-rose-600">STEP 02 • ARTISAN WEAVE</span>
            <p className="font-display font-bold text-sm mt-1">Hand-Knotted & Mist-Hydrated for Your Ceremony</p>
          </StackingCard>
        </div>
      </section>
    </div>
  );
}
