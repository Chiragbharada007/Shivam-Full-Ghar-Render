"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Layers,
  FileText,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { SearchResponse, SearchResultItem } from "@/lib/search";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export function GlobalSearchModal({ isOpen, onClose, locale }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setResults(null);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setResults(data);
          }
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, locale]);

  if (!isOpen) return null;

  const popularSearches = [
    { label: locale === "gu" ? "રોયલ ગુલાબ વરમાળા" : "Royal Rose Varmala", query: "rose" },
    { label: locale === "gu" ? "મદુરાઈ મોગરા ગજરા" : "Madurai Mogra Gajra", query: "mogra" },
    { label: locale === "gu" ? "બ્રાઈડલ વેણી" : "Bridal Hair Veni", query: "hair-flowers" },
    { label: locale === "gu" ? "લક્ઝરી કાર સજાવટ" : "Wedding Car Decor", query: "car" },
    { label: locale === "gu" ? "લગ્ન પેકેજ" : "Wedding Packages", query: "package" },
    { label: locale === "gu" ? "કસ્ટમ ઓર્ડર" : "Custom Garland", query: "custom" },
  ];

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/${locale}/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const hasResults =
    results &&
    (results.products.length > 0 ||
      results.categories.length > 0 ||
      results.pages.length > 0);

  const showNoResults = results && !isLoading && !hasResults && query.trim().length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={locale === "gu" ? "શોધો" : "Search"}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-6"
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-150 text-zinc-900 dark:text-white flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-black/10 dark:border-white/10 shrink-0"
        >
          <Search className="w-5 h-5 text-brand-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              locale === "gu"
                ? "વરમાળા, મોગરા, વેણી, કાર સજાવટ, પેકેજ શોધો..."
                : locale === "hi"
                ? "वरमाला, मोगरा, वेणी, कार सजावट, पैकेज खोजें..."
                : "Search varmala, mogra, veni, car decor, packages..."
            }
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden"
          />
          {isLoading && (
            <Loader2 className="w-4 h-4 text-brand-primary animate-spin shrink-0" />
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults(null);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
          >
            ESC
          </button>
        </form>

        {/* Scrollable Results / Suggestions Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-5 divide-y divide-black/5 dark:divide-white/5">
          {/* Default: Popular Quick Searches when input is empty */}
          {!query.trim() && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{locale === "gu" ? "લોકપ્રિય શોધો" : locale === "hi" ? "लोकप्रिय खोज" : "Popular Searches"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setQuery(item.query)}
                    className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-brand-primary dark:hover:text-brand-primary bg-black/5 dark:bg-white/5 hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 px-3.5 py-2 rounded-full border border-black/10 dark:border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories Matches */}
          {results && results.categories.length > 0 && (
            <div className="space-y-2.5 pt-3 first:pt-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                <Layers className="w-3.5 h-3.5 text-brand-primary" />
                <span>{locale === "gu" ? "કેટેગરી" : locale === "hi" ? "श्रेणियां" : "Categories"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.categories.map((cat: SearchResultItem) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.url)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-left transition-colors cursor-pointer group"
                  >
                    {cat.image ? (
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                        <Image
                          src={cat.image}
                          alt={cat.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="44px"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-brand-primary transition-colors">
                        {cat.title}
                      </div>
                      {cat.subtitle && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {cat.subtitle}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-primary transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Matches */}
          {results && results.products.length > 0 && (
            <div className="space-y-2.5 pt-3 first:pt-0">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                <span className="flex items-center gap-2">
                  <span>🌸</span>
                  <span>{locale === "gu" ? "પ્રોડક્ટ્સ" : locale === "hi" ? "उत्पाद" : "Floral Products"}</span>
                </span>
                <span className="text-[10px] text-zinc-400">
                  {results.products.length} {locale === "gu" ? "પરિણામ" : "results"}
                </span>
              </div>
              <div className="space-y-1.5">
                {results.products.map((p: SearchResultItem) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelect(p.url)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-left transition-colors cursor-pointer group"
                  >
                    {p.image ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                        🌸
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-brand-primary transition-colors">
                          {p.title}
                        </span>
                        {p.badge && (
                          <span className="px-1.5 py-0.5 rounded-md bg-brand-primary/15 text-brand-primary dark:text-brand-primary border border-brand text-[10px] font-mono font-bold shrink-0">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      {p.subtitle && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                          {p.subtitle}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-primary transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Website Pages Matches */}
          {results && results.pages.length > 0 && (
            <div className="space-y-2.5 pt-3 first:pt-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>{locale === "gu" ? "વેબસાઇટ પેજ" : locale === "hi" ? "वेबसाइट पेज" : "Pages"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.pages.map((page: SearchResultItem) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => handleSelect(page.url)}
                    className="flex items-start gap-3 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-left transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-brand-primary transition-colors">
                          {page.title}
                        </span>
                        {page.badge && (
                          <span className="px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 text-[9px] font-semibold">
                            {page.badge}
                          </span>
                        )}
                      </div>
                      {page.subtitle && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                          {page.subtitle}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clean No-Results State */}
          {showNoResults && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-2xl">
                🔍
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                  {locale === "gu"
                    ? `"${query}" માટે કોઈ પરિણામ મળ્યું નથી`
                    : locale === "hi"
                    ? `"${query}" के लिए कोई परिणाम नहीं मिला`
                    : `No results found for "${query}"`}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {locale === "gu"
                    ? "કૃપા કરીને વરમાળા, વેણી, મોગરા, કાર સજાવટ અથવા પેકેજ જેવા શબ્દો અજમાવો."
                    : "Try searching with words like varmala, jaimala, veni, mogra, car decor, or packages."}
                </p>
              </div>

              {/* Direct Boutique WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/919824132014?text=${encodeURIComponent(
                    `Hello Shivam Full Ghar, I am searching for "${query}" on your website. Can you help me?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary text-white font-semibold text-xs transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {locale === "gu"
                      ? "વોટ્સએપ પર ફ્લોરિસ્ટને પૂછો"
                      : "Ask Florist on WhatsApp"}
                  </span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: View all in shop & quick hint */}
        <div className="p-3 sm:p-4 border-t border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
          <span className="hidden sm:inline">
            {locale === "gu" ? "એન્ટર દબાવો આખી શોપમાં શોધવા માટે" : "Press Enter to view all in store"}
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary dark:text-brand-primary hover:underline cursor-pointer"
          >
            <span>{locale === "gu" ? "શોપમાં બધા પરિણામો જુઓ" : "View all results in Shop"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}
